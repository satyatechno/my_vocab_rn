import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import CustomButton from 'src/components/customButton/CustomButton';
import {useEffect} from 'react';
import axios from 'axios';
import Pie from 'react-native-pie';
import Modal from 'react-native-modal';
import fonts from 'src/styles/texts/fonts';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

const Item = ({item, index, onSelect, selected}) => {
  const findOption = () => {
    switch (index + 1) {
      case 1:
        return 'A';
      case 2:
        return 'B';
      case 3:
        return 'C';
      case 4:
        return 'D';
      default:
        return '';
    }
  };
  return (
    <CustomButton
      onPress={() => onSelect(item)}
      style={{
        flexDirection: 'row',
        padding: findHeight(10),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: selected?.id == item?.id ? '#9E57D5' : 'lightgray',
        marginTop: 25,
        borderRadius: 4,
      }}>
      <View style={{width: '13%', height: '100%'}}>
        <View
          style={{
            backgroundColor: '#AC5CEA',
            borderColor: '#9E57D5',
            height: findHeight(30),
            width: findHeight(30),
            borderRadius: findSize(7),
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            borderWidth: 2,
            top: -findHeight(25),
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: findSize(16),
              fontFamily: fonts.Philosopher,
            }}>
            {findOption()}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: findSize(15),
          color: colors.defaultWhite,
          fontFamily: fonts.Philosopher,
          marginHorizontal: '1%',
          color: '#000',
          flex: 1,
        }}>
        {item?.word_meaning}
      </Text>
      <View
        style={{
          height: 18,
          width: 18,
          borderRadius: 9,
          justifyContent: 'center',
          alignItems: 'center',

          backgroundColor: selected?.id == item?.id ? '#fff' : 'lightgray',
          marginHorizontal: 7,
        }}>
        {selected?.id == item?.id ? (
          <Image
            source={require('src/assets/images/check.png')}
            style={{
              height: 16,
              width: 16,
            }}
          />
        ) : null}
      </View>
    </CustomButton>
  );
};
const PlayQuiz = ({navigation, route}) => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [currertQuestion, setCurrertQuestion] = useState({});
  const [currertOptions, setCurrertOptions] = useState([]);
  const [counter, setCount] = useState(20);
  const [timerRef, setTimerRef] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState();
  const {isFocused} = useNavigation();
  const isFocused_ = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
      console.log('Enter Focus');
      if (isFocused_) {
        setAnswers([]);
        setResult({});
        setSelected({});
        getQuiz();
      }
    }, []),
  );

  console.log('isFocused', isFocused, isFocused_);
  useEffect(() => {
    clearInterval(timerRef);
    !isFocused_ && setCount(20);
  }, [isFocused_]);

  const getQuiz = async () => {
    const {type, limit} = route?.params;
    try {
      setLoading(true);
      const res = await axios.post('http://word-app.pairroxz.in/api/quiz', {
        type: type,
        limit: limit,
      });
      console.log('hhhhhh', [...res.data?.data?.quiz].length);
      setData([...res.data?.data?.quiz]);
      setActiveQuestion(0);
      setCurrertQuestion(res.data?.data?.quiz?.[0]);
      startTime();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('error', e);
    }
  };

  useEffect(() => {
    if (activeQuestion !== null) {
      setCurrertQuestion(data?.[activeQuestion]);
    }
  }, [activeQuestion]);
  useEffect(() => {
    // clearInterval(timerRef);
    if (currertQuestion?.id) {
      setCount(20);
      let Temp = [...currertQuestion?.options, currertQuestion?.answer];
      setCurrertOptions(
        [...Temp]?.sort((a, b) => (Math.random() > 0.5 ? 1 : -1)),
      );

      setSelected({});

      // startTime();
    }
  }, [currertQuestion?.id]);

  const startTime = () => {
    console.log('first');
    // if (timerRef !== null) clearInterval(timerRef);
    let temp = setInterval(() => {
      if (counter > 0) {
        console.log('second');
        setCount(ss => ss - 1);
      }
    }, 1200);
    setTimerRef(temp);
  };
  useEffect(() => {
    if (counter < 1) {
      // clearInterval(timerRef);
      if (activeQuestion < data?.length - 1) {
        setAnswers([
          ...answers,
          {
            que: currertQuestion?.id,
            ans: selected?.word_id,
            question: currertQuestion?.question,
            answer: selected?.word_meaning,
            correct: currertQuestion?.answer?.word_meaning,
          },
        ]);
        setActiveQuestion(p => p + 1);
      } else {
        setAnswers([
          ...answers,
          {
            que: currertQuestion?.id,
            ans: selected?.word_id,
            question: currertQuestion?.question,
            answer: selected?.word_meaning,
            correct: currertQuestion?.answer?.word_meaning,
          },
        ]);
        setTimeout(() => {
          onSubmit([
            ...answers,
            {
              que: currertQuestion?.id,
              ans: selected?.word_id,
              question: currertQuestion?.question,
              answer: selected?.word_meaning,
              correct: currertQuestion?.answer?.word_meaning,
            },
          ]);
        }, 1000);
      }
    }
  }, [counter]);
  const onSubmit = ANS => {
    clearInterval(timerRef);

    let total = data.length;
    let right = ANS?.filter(x => x.que === x.ans);
    let wrong = ANS?.filter(x => x.que !== x.ans);
    setResult({total, right: [...right], wrong: [...wrong]});
    setModalVisible(true);
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            backgroundColor: '#9E57D5',
            width: '100%',
            height: findHeight(160),
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20,
            position: 'absolute',
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
            marginBottom: 20,
            marginHorizontal: 20,
          }}>
          <CustomButton
            onPress={() => {
              navigation?.goBack();
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
              source={require('src/assets/images/back.png')}
              style={{
                backgroundColor: '#D5A0FF',
                height: 16,
                width: 11,
              }}
            />
          </CustomButton>
          <Text
            style={{
              fontSize: findSize(20),
              color: colors.defaultWhite,
              fontFamily: fonts.Philosopher,
            }}>
            Play Quiz
          </Text>
          <View
            style={{
              height: findSize(43),
              width: findSize(43),
            }}
          />
        </View>
        <View style={{}}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',

              padding: 15,
              borderRadius: 5,
              alignSelf: 'center',
              marginHorizontal: 40,
              justifyContent: 'center',
              shadowOffset: {
                height: 1,
                width: 1,
              },
              shadowColor: 'gray',
              shadowOpacity: 0.8,
              width: '80%',
              marginTop: 30,
            }}>
            <View
              style={{
                height: 71,
                width: 71,
                borderRadius: 36,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -50,
                backgroundColor: '#fff',
              }}>
              <Pie
                radius={30}
                innerRadius={26}
                backgroundColor={'#FFF'}
                sections={[
                  {
                    percentage: (counter / 20) * 100,
                    color: '#9E57D5',
                  },
                ]}
                dividerSize={2}
                strokeCap={'round'}
              />
              <Text
                style={{
                  color: '#9E57D5',
                  fontSize: 18,
                  position: 'absolute',
                  fontWeight: 'bold',
                  fontFamily: fonts.Philosopher,
                }}>
                {counter}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 18,
                  fontFamily: fonts.Philosopher,
                  marginEnd: 10,
                }}>
                {activeQuestion + 1}.
              </Text>
              <Text
                style={{
                  color: '#000',
                  fontSize: 18,
                  fontFamily: fonts.Philosopher,
                  flex: 1,
                }}>
                {currertQuestion?.question}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 10,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <FlatList
            data={currertOptions}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <Item
                item={item}
                index={index}
                selected={selected}
                onSelect={aa => setSelected(aa)}
              />
            )}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text style={{color: 'black', fontFamily: fonts.Philosopher}}>
                  There is no Quiz available right now,
                </Text>
              </View>
            )}
            ListFooterComponent={() =>
              data?.length ? (
                <View style={{}}>
                  <CustomButton
                    type={1}
                    title={
                      activeQuestion === data?.length - 1 ? 'Submit' : 'Save'
                    }
                    onPress={() => {
                      // clearInterval(timerRef);
                      if (activeQuestion < data?.length - 1) {
                        setAnswers([
                          ...answers,
                          {
                            que: currertQuestion?.id,
                            ans: selected?.word_id,
                            question: currertQuestion?.question,
                            answer: selected?.word_meaning,
                            correct: currertQuestion?.answer?.word_meaning,
                          },
                        ]);
                        setActiveQuestion(activeQuestion + 1);
                      } else {
                        setAnswers([
                          ...answers,
                          {
                            que: currertQuestion?.id,
                            ans: selected?.word_id,
                            question: currertQuestion?.question,
                            answer: selected?.word_meaning,
                            correct: currertQuestion?.answer?.word_meaning,
                          },
                        ]);

                        onSubmit([
                          ...answers,
                          {
                            que: currertQuestion?.id,
                            ans: selected?.word_id,
                            question: currertQuestion?.question,
                            answer: selected?.word_meaning,
                            correct: currertQuestion?.answer?.word_meaning,
                          },
                        ]);
                      }
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
              ) : (
                <View />
              )
            }
          />
        </View>
      </SafeAreaView>
      <Modal
        isVisible={modalVisible}
        hasBackdrop={false}
        onBackButtonPress={() => {
          setAnswers([]);
          setResult({});
          setModalVisible(false);
          navigation?.goBack();
        }}
        onBackdropPress={() => {
          setAnswers([]);
          setResult({});
          setModalVisible(false);
        }}
        style={{backgroundColor: 'rgba(134, 118, 105, 0.3)', margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            height: '80%',
            marginHorizontal: 10,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000',
                    fontFamily: fonts.Philosopher,
                  }}>
                  Total Question
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000',
                    fontFamily: fonts.Philosopher,
                  }}>
                  {result?.total}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'green',
                    fontFamily: fonts.Philosopher,
                  }}>
                  Correct Answers
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'green',
                    fontFamily: fonts.Philosopher,
                  }}>
                  {result?.right?.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'red',
                    fontFamily: fonts.Philosopher,
                  }}>
                  Wrong Answers
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'red',
                    fontFamily: fonts.Philosopher,
                  }}>
                  {result?.wrong?.length}
                </Text>
              </View>
              {result?.wrong?.length
                ? result?.wrong?.map(x => {
                    return (
                      <View style={{marginVertical: 10}}>
                        <Text
                          style={{
                            fontFamily: fonts.Philosopher,
                            fontSize: 14,
                            color: '#000',
                          }}>
                          <Text style={{fontWeight: 'bold'}}>Question.</Text>{' '}
                          {x?.question}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fonts.Philosopher,
                            fontSize: 13,
                            color: 'red',
                          }}>
                          <Text style={{fontWeight: 'bold'}}>Your Ans.</Text>{' '}
                          {x?.answer ?? '-'}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fonts.Philosopher,
                            fontSize: 13,
                            color: 'green',
                          }}>
                          <Text style={{fontWeight: 'bold'}}>Correct Ans.</Text>{' '}
                          {x?.correct}
                        </Text>
                      </View>
                    );
                  })
                : null}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <CustomButton
                  type={1}
                  title="Done"
                  onPress={() => {
                    setActiveQuestion(0);
                    setAnswers([]);
                    setResult({});
                    setModalVisible(false);
                    navigation?.goBack();
                  }}
                  style={{
                    backgroundColor: '#9E57D5',
                    width: '35%',
                    height: 40,
                    alignSelf: 'center',
                  }}
                  textStyle={{fontSize: 15, fontFamily: fonts.Philosopher}}
                />
                {/* <CustomButton
              type={2}
              title="Clear"
              onPress={() => {
                setActiveQuestion(0);
                setAnswers([]);
                setResult({});
                setModalVisible(false);
                navigation?.goBack();
              }}
              style={{
                borderColor: '#9E57D5',
                width: '35%',
                height: 40,
                alignSelf: 'center',
              }}
              textStyle={{color: '#9E57D5', fontSize: 15}}
            /> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default PlayQuiz;

const styles = StyleSheet.create({});
