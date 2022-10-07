import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Linking,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {capitalizeFirstLetter, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import CustomButton from 'src/components/customButton/CustomButton';
import axios from 'axios';
import {errorToast, successToast} from 'src/utils/toast';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {useRef} from 'react';
import fonts from 'src/styles/texts/fonts';
import {useDispatch, useSelector} from 'react-redux';
import {addNewWord, setWordData} from 'src/redux/reducers/reducer';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Container from 'src/components/container/Container';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Clipboard from '@react-native-clipboard/clipboard';
import Modal from 'react-native-modal';

const TYPES = [
  {id: 'word', text: 'Word'},
  {id: 'idiom', text: 'Idioms'},
  {id: 'phrase', text: 'Phrase'},
];
const Vocab = ({navigation, route}) => {
  const data = useSelector(state => state?.reducer?.wordData);
  const {setParams} = useNavigation();
  const [type, setType] = useState('word');
  const [word, setWord] = useState('');
  const [mean, setMean] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [fetchResult, setFetchResult] = useState();
  const [quickArray, setQuickArray] = useState([]);
  const [quickWord, setQuickWord] = useState('');
  const [meaningInputPosition, setMeaningInputPosition] = useState();
  const [exampleInputPosition, setExampleInputPosition] = useState();
  const meaningsRef = useRef(null);
  const exampleRef = useRef(null);
  const item = route?.params?.item;
  const dispatch = useDispatch();
  useEffect(() => {
    if (item) {
      setWord(item?.word);
      setType(item?.word_type);
      setMean(item?.answer?.word_meaning);
      if (item?.answer?.example) {
        setExample(item?.answer?.example);
      }
    }
  }, [item]);

  const onSubmit = async () => {
    if (!word?.trim()) {
      errorToast('Word feild is required.');
    } else if (!mean?.trim()) {
      errorToast('Meaning feild is required.');
    } else {
      try {
        setLoading(true);
        PreventTouch(true, false);
        const res = await axios.post(
          `http://word-app.pairroxz.in/api/words${
            item?.id ? '/update/' + item?.id : ''
          }`,
          {
            word_type: type,
            word: word,
            word_meaning: mean,
            example: example,
          },
        );
        // console.log('data', res.data);
        setFetchResult([]);
        setWord('');
        setMean('');
        setExample('');

        successToast(res.data.message);
        setLoading(false);

        dispatch(addNewWord(res.data?.data?.words));
      } catch (e) {
        setLoading(false);
        console.log('error', e);
        if (e?.response?.data?.message) {
          errorToast(e?.response?.data?.message);
        }
      } finally {
        PreventTouch(false, false);
      }
    }
  };

  const fetchMeaning = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(
        `https://od-api.oxforddictionaries.com/api/v2/entries/en/${word?.toLowerCase()}`,
        {
          headers: {
            app_id: 'd52e7b0c',
            app_key: '5178c527e135dadde7197e102ec3ba0f',
          },
          params: {
            // lexicalCategory: 'noun,verb',
            fields: 'definitions,examples',
          },
        },
      );

      let TempArray = [];

      res?.data?.results?.map(frist => {
        frist?.lexicalEntries?.map(second => {
          if (second?.lexicalCategory?.id) {
            let temp = {};
            if (second?.entries?.[0]?.senses?.[0]?.definitions?.[0]) {
              temp = {
                definition: second?.entries?.[0]?.senses?.[0]?.definitions?.[0],
              };
            }
            if (second?.entries?.[0]?.senses?.[0]?.examples?.[0]?.text) {
              temp = {
                ...temp,
                example: second?.entries?.[0]?.senses?.[0]?.examples?.[0]?.text,
              };
            }
            // if (temp?.definition) {
            let ss = TempArray?.findIndex(
              x => x.id === second?.lexicalCategory?.id,
            );
            if (ss > -1) {
              TempArray[ss] = {
                id: second?.lexicalCategory?.id,
                data: [...TempArray[ss]?.data, temp],
              };
            } else {
              TempArray?.push({
                id: second?.lexicalCategory?.id,
                data: [temp],
              });
            }
          }
          // }
        });
      });

      setFetchResult([...TempArray]);

      setExample('');
      setMean('');

      // ]);
    } catch (e) {
      console.log('error', e?.response?.data);
      if (e?.response?.data?.error) {
        errorToast(e?.response?.data?.error);
      }
      setExample('');
      setMean('');
      setFetchResult([]);
    } finally {
      setFetchLoading(false);
    }
  };
  const fetchGoogle = async () => {
    Linking.openURL(
      `https://google.com/search?q=${word?.toLowerCase()} meaning`,
    );
  };

  const addQuickWords = async () => {
    try {
      setQuickLoading(true);
      PreventTouch(true, false);
      const res = await axios.post(
        `http://word-app.pairroxz.in/api/words/add-multiple`,
        {
          word_type: 'word',
          words: quickArray,
        },
      );
      console.log('data', res.data);

      setModalVisible(false);
      setQuickArray([]);
      setQuickWord('');
      successToast(res.data.message);
      setQuickLoading(false);
    } catch (e) {
      setQuickLoading(false);
      console.log('error', e);
      if (e?.response?.data?.message) {
        errorToast(e?.response?.data?.message);
      }
    } finally {
      PreventTouch(false, false);
    }
  };
  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{backgroundColor: colors.defaultWhite}}>
      <View
        style={{
          backgroundColor: '#9E57D5',
          width: '100%',
          height: findHeight(120),
          borderBottomEndRadius: 20,
          borderBottomLeftRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: -999,
        }}>
        <Image
          source={require('src/assets/images/background.png')}
          style={{
            height: null,
            width: null,
            flex: 1,
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: findHeight(40),
          marginHorizontal: 20,
        }}>
        <CustomButton
          onPress={() => {
            navigation?.openDrawer();
          }}
          style={{
            backgroundColor: '#D5A0FF',
            height: findHeight(43),
            width: findHeight(43),
            borderRadius: findSize(7),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('src/assets/images/menu.png')}
            style={{
              backgroundColor: '#D5A0FF',
              height: 17,
              width: 19,
            }}
          />
        </CustomButton>
        <Text
          style={{
            fontSize: findSize(20),
            color: colors.defaultWhite,
            fontFamily: fonts.Philosopher,
          }}>
          Submit your vocab
        </Text>

        <CustomButton
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            backgroundColor: '#D5A0FF',
            height: findHeight(43),
            width: findHeight(43),
            borderRadius: findSize(7),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="plus" size={25} color={colors.defaultWhite} />
        </CustomButton>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 60,
          paddingHorizontal: 20,
        }}>
        {/* <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: fonts.Philosopher,
              }}>
              Submit your vocab
            </Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: findHeight(30),
            width: '75%',
          }}>
          {TYPES.map(item => (
            <CustomButton
              onPress={() => {
                setType(item.id);
              }}
              key={item?.id}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: type == item.id ? 0 : 1,
                  borderColor: 'gray',
                  backgroundColor: '#fff',
                  marginHorizontal: 7,
                }}>
                {type == item.id ? (
                  <Image
                    style={{height: 18, width: 18, resizeMode: 'contain'}}
                    source={require('src/assets/images/check.png')}
                  />
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: fonts.Philosopher,
                }}>
                {item.text}
              </Text>
            </CustomButton>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '73%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: findSize(50),

              borderRadius: findSize(25),
              backgroundColor: '#fff',

              shadowOffset: {
                height: 1,
                width: 1,
              },
              shadowColor: 'gray',
              shadowOpacity: 0.8,
            }}>
            <TextInput
              value={word}
              placeholder="Your Word"
              placeholderTextColor={colors.appGray2}
              onChangeText={text => {
                setWord(text);
                setFetchResult([]);
              }}
              onBlur={() => {}}
              returnKeyType="default"
              style={{
                height: findSize(50),
                flex: 1,
                borderRadius: findSize(25),
                backgroundColor: '#fff',
                padding: 15,

                fontFamily: fonts.Philosopher,
              }}
            />
            <View style={{position: 'relative', end: 10}}>
              {word?.length ? (
                <CustomButton
                  onPress={() => {
                    setWord('');
                    setFetchResult([]);
                  }}
                  style={{
                    backgroundColor: colors?.appGray1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    padding: 5,
                  }}>
                  <Ionicons name="close" size={18} color={colors.appGray} />
                </CustomButton>
              ) : null}
            </View>
          </View>
          <CustomButton
            type={1}
            title="Find"
            isLoading={fetchLoading}
            onPress={() => {
              Keyboard.dismiss();
              if (word?.trim()) fetchMeaning();
              else {
                errorToast('Word feild is required.');
              }
            }}
            style={{
              backgroundColor: '#9E57D5',
              width: '25%',
              height: 48,
              alignSelf: 'center',
              shadowOffset: {
                height: 1,
                width: 1,
              },
              shadowColor: 'gray',
              shadowOpacity: 0.8,
            }}
            textStyle={{fontFamily: fonts.Philosopher}}
          />
        </View>
        <View>
          <CustomButton
            type={1}
            title="Browse"
            onPress={() => {
              Keyboard.dismiss();
              if (word?.trim()) fetchGoogle();
              else {
                errorToast('Word feild is required.');
              }
            }}
            style={{
              backgroundColor: '#9E57D5',
              width: '100%',
              height: 48,
              alignSelf: 'center',
              shadowOffset: {
                height: 1,
                width: 1,
              },
              shadowColor: 'gray',
              shadowOpacity: 0.8,
            }}
            textStyle={{fontFamily: fonts.Philosopher}}
          />
        </View>
        <View>
          {fetchResult?.map((item, index) => (
            <View key={index?.toString()}>
              {item?.data?.length ? (
                <Text
                  style={{
                    color: '#9E57D5',
                    fontSize: 15,
                    marginTop: 20,
                    fontFamily: fonts.Philosopher,
                  }}>
                  {capitalizeFirstLetter(item?.id ?? ' ')}
                </Text>
              ) : null}
              <View>
                {item?.data?.map((x, y) => (
                  <View key={y?.toString()} style={{marginVertical: 4}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 16,
                          flex: 1,
                          marginBottom: 2,
                          marginEnd: 10,
                          fontFamily: fonts.Philosopher,
                        }}>
                        * {x?.definition}
                      </Text>
                      <CustomButton
                        onPress={() => {
                          Clipboard.setString(x?.definition);
                          successToast('Copied');
                          // setMean(x?.definition);
                          // meaningsRef?.current?.focus();
                        }}>
                        <Ionicons name="copy1" color={'#9E57D5'} size={20} />
                      </CustomButton>
                    </View>
                    {x?.example ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: 14,
                            marginTop: 2,
                            fontFamily: fonts.Philosopher,
                          }}>
                          Ex. {x?.example}
                        </Text>
                        <CustomButton
                          onPress={() => {
                            Clipboard.setString(x?.example);
                            successToast('Copied');
                            // setExample(x?.example);
                            // exampleRef?.current?.focus();
                          }}>
                          <Ionicons name="copy1" color={'#9E57D5'} size={20} />
                        </CustomButton>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        {mean?.length ? (
          <Text
            style={{
              color: '#9E57D5',
              fontSize: 15,
              marginTop: 20,
              fontFamily: fonts.Philosopher,
            }}>
            Meaning
          </Text>
        ) : null}

        <TextInput
          placeholder="Meaning"
          placeholderTextColor={colors.appGray2}
          onChangeText={text => {
            setMean(text);
          }}
          value={mean}
          ref={meaningsRef}
          multiline={true}
          numberOfLines={5}
          returnKeyType="default"
          style={{
            minHeight: findSize(120),
            maxHeight: findSize(200),
            marginBottom: 20,
            marginTop: 5,
            width: '100%',
            borderRadius: findSize(25),
            backgroundColor: '#fff',
            paddingLeft: 15,
            paddingTop: 15,
            textAlignVertical: 'top',
            shadowOffset: {
              height: 1,
              width: 1,
            },
            shadowColor: 'gray',
            shadowOpacity: 0.8,
            fontFamily: fonts.Philosopher,
          }}
        />

        {example?.length ? (
          <Text
            style={{
              color: '#9E57D5',
              fontSize: 15,
              marginTop: 20,
              fontFamily: fonts.Philosopher,
            }}>
            Example (Optional)
          </Text>
        ) : null}
        <TextInput
          placeholder="Example (Optional)"
          placeholderTextColor={colors.appGray2}
          onChangeText={text => {
            setExample(text);
          }}
          ref={exampleRef}
          returnKeyType="default"
          value={example}
          multiline={true}
          numberOfLines={5}
          style={{
            minHeight: findSize(90),
            maxHeight: findSize(200),
            marginBottom: 20,
            marginTop: 5,
            width: '100%',
            borderRadius: findSize(25),
            backgroundColor: '#fff',
            paddingLeft: 15,
            paddingTop: 15,
            textAlignVertical: 'top',
            shadowOffset: {
              height: 1,
              width: 1,
            },
            shadowColor: 'gray',
            shadowOpacity: 0.8,
            fontFamily: fonts.Philosopher,
          }}
        />
        <CustomButton
          type={1}
          title={item?.id ? 'Update' : 'Submit'}
          isLoading={loading}
          onPress={() => {
            Keyboard.dismiss();
            onSubmit();
          }}
          style={{
            backgroundColor: '#9E57D5',
            width: '40%',
            height: 50,
            alignSelf: 'center',
          }}
          textStyle={{fontFamily: fonts.Philosopher}}
        />
      </View>
      <Modal
        isVisible={modalVisible}
        hasBackdrop={false}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          backgroundColor: 'rgba(134, 118, 105, 0.3)',
          margin: 0,
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              color: colors.defaultBlack,
              fontSize: 18,
              fontFamily: fonts.Philosopher,
              margin: 20,
            }}>
            Add Quick Words
          </Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <View
                style={{
                  width: '73%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: findSize(40),

                  borderRadius: findSize(25),
                  backgroundColor: '#fff',

                  shadowOffset: {
                    height: 1,
                    width: 1,
                  },
                  shadowColor: 'gray',
                  shadowOpacity: 0.8,
                }}>
                <TextInput
                  value={quickWord}
                  placeholder="Quick Word"
                  placeholderTextColor={colors.appGray2}
                  onChangeText={text => {
                    setQuickWord(text);
                  }}
                  onSubmitEditing={() => {
                    if (quickWord?.trim()) {
                      if (quickArray?.includes(quickWord)) {
                        errorToast(
                          `${quickWord} is already exist in your quick list.`,
                        );
                      } else {
                        setQuickArray(prev => [...prev, quickWord]);
                        setQuickWord('');
                      }
                    } else {
                      errorToast('Quick Word feild is required.');
                    }
                  }}
                  returnKeyType="done "
                  style={{
                    height: findSize(40),
                    flex: 1,
                    borderRadius: findSize(25),
                    backgroundColor: '#fff',
                    paddingStart: 15,

                    fontFamily: fonts.Philosopher,
                  }}
                />
                <View style={{position: 'relative', end: 10}}>
                  {quickWord?.length ? (
                    <CustomButton
                      onPress={() => {
                        setQuickWord('');
                      }}
                      style={{
                        backgroundColor: colors?.appGray1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        padding: 5,
                      }}>
                      <Ionicons name="close" size={18} color={colors.appGray} />
                    </CustomButton>
                  ) : null}
                </View>
              </View>
              <CustomButton
                type={1}
                title="Add"
                isLoading={fetchLoading}
                onPress={() => {
                  if (quickWord?.trim()) {
                    if (quickArray?.includes(quickWord)) {
                      errorToast(
                        `${quickWord} is already exist in your quick list.`,
                      );
                    } else {
                      setQuickArray(prev => [...prev, quickWord]);
                      setQuickWord('');
                    }
                  } else {
                    errorToast('Quick Word feild is required.');
                  }
                }}
                style={{
                  backgroundColor: '#9E57D5',
                  width: '23%',
                  height: 40,
                  alignSelf: 'center',
                  shadowOffset: {
                    height: 1,
                    width: 1,
                  },
                  shadowColor: 'gray',
                  shadowOpacity: 0.8,
                }}
                textStyle={{fontFamily: fonts.Philosopher}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 10,
              }}>
              {quickArray?.map(item => (
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    shadowOffset: {
                      height: 1,
                      width: 1,
                    },
                    shadowColor: 'gray',
                    shadowOpacity: 0.8,
                    alignSelf: 'flex-start',
                    margin: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: findSize(13),
                      color: '#9E57D5',
                      fontFamily: fonts.Philosopher,
                      alignSelf: 'flex-start',
                    }}>
                    {capitalizeFirstLetter(item ?? ' ')}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <CustomButton
                type={1}
                title="Submit"
                isLoading={quickLoading}
                onPress={() => {
                  if (quickArray?.length) {
                    addQuickWords();
                  } else {
                    errorToast('Please add atleast a quick word.');
                  }
                }}
                style={{
                  backgroundColor: '#9E57D5',
                  width: '40%',
                  height: 40,
                  alignSelf: 'center',
                }}
                textStyle={{fontSize: 15, fontFamily: fonts.Philosopher}}
              />
              <CustomButton
                type={2}
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setQuickArray([]);
                  setQuickWord('');
                }}
                style={{
                  borderColor: '#9E57D5',
                  width: '40%',
                  height: 40,
                  alignSelf: 'center',
                }}
                textStyle={{color: '#9E57D5', fontSize: 15}}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default Vocab;

const styles = StyleSheet.create({});
