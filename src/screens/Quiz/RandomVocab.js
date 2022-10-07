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
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {capitalizeFirstLetter, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import CustomButton from 'src/components/customButton/CustomButton';
import axios from 'axios';
import Modal from 'react-native-modal';
import fonts from 'src/styles/texts/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {successToast} from 'src/utils/toast';
import {useDispatch, useSelector} from 'react-redux';
import {addRandomWord, setWordData} from 'src/redux/reducers/reducer';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';

const CancelToken = axios.CancelToken;
export let searchApiToken = null;
const Item = ({item}) => {
  return (
    <>
      <TouchableOpacity
        // activeOpacity={1}

        disabled
        style={{
          flexDirection: 'row',
          padding: 10,
          width: '100%',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: findSize(13),
            color: colors.defaultWhite,
            width: '39%',
            marginEnd: '2%',
            color: '#000',
            fontFamily: fonts.Philosopher,
          }}>
          {item?.word}
          {item?.word_type == 'idiom' ? (
            <Text style={{color: '#9E57D5'}}>{` (i)`}</Text>
          ) : null}
        </Text>

        <Text
          style={{
            fontSize: findSize(13),

            width: '59%',
            color: '#838383',
            fontFamily: fonts.Philosopher,
          }}>
          {item?.answer?.word_meaning}
          {item?.answer?.example ? (
            <Text
              style={{
                fontSize: findSize(12),
                width: '59%',
                color: '#838379',
                fontFamily: fonts.Philosopher,
              }}>
              {'\n'}
              Ex. {item?.answer?.example}
            </Text>
          ) : null}
        </Text>
      </TouchableOpacity>
    </>
  );
};
const RandomVocab = ({navigation}) => {
  const randomWords = useSelector(state => state?.reducer?.randomWords);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [meaning, setMeaning] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // getVocabData();
    return () => {
      dispatch(addRandomWord([]));
    };
  }, []);

  const getVocabData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const res = await axios.get(
        'http://word-app.pairroxz.in/api/words/random',
      );
      console.log('dada', res.data.data);
      dispatch(addRandomWord([...res.data?.data?.words]));

      setLoading(false);

      setRefreshing(false);
    } catch (e) {
      setLoading(false);

      setRefreshing(false);
      console.log('error data', e);
    }
  };

  // if (data?.length == 0) {
  //   return (
  //     <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
  //       <View
  //         style={{
  //           backgroundColor: '#9E57D5',
  //           width: '100%',
  //           height: findHeight(180),
  //           borderBottomEndRadius: 20,
  //           borderBottomLeftRadius: 20,
  //           position: 'absolute',
  //           zIndex: -999,
  //         }}>
  //         <Image
  //           source={require('src/assets/images/background.png')}
  //           style={{
  //             height: null,
  //             width: null,
  //             flex: 1,
  //             borderBottomEndRadius: 20,
  //             borderBottomLeftRadius: 20,
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //           marginVertical: findHeight(40),
  //           marginHorizontal: 20,
  //         }}>
  //         <CustomButton
  //           onPress={() => {
  //             navigation?.goBack();
  //           }}
  //           style={{
  //             backgroundColor: '#D5A0FF',
  //             height: findHeight(43),
  //             width: findHeight(43),
  //             borderRadius: findSize(7),
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           <Image
  //             source={require('src/assets/images/back.png')}
  //             style={{
  //               backgroundColor: '#D5A0FF',
  //               height: 16,
  //               width: 11,
  //             }}
  //           />
  //         </CustomButton>
  //         <Text
  //           style={{
  //             fontSize: findSize(20),
  //             color: colors.defaultWhite,
  //             fontFamily: fonts.Philosopher,
  //           }}>
  //           Random Vocabulary
  //         </Text>
  //         <View
  //           style={{
  //             height: findSize(43),
  //             width: findSize(43),
  //           }}
  //         />
  //       </View>

  //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //         {loading ? (
  //           <ActivityIndicator color={'#9E57D5'} size={'large'} />
  //         ) : (
  //           <>
  //             <CustomButton
  //               onPress={() => getVocabData()}
  //               style={{
  //                 backgroundColor: '#9E57D5',
  //                 width: '90%',
  //                 height: 45,
  //               }}
  //               type={1}
  //               title={'Show Random Vocab'}
  //             />
  //           </>
  //         )}
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // if (data.length && !meaning) {
  //   return (
  //     <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
  //       <View
  //         style={{
  //           backgroundColor: '#9E57D5',
  //           width: '100%',
  //           height: findHeight(140),
  //           borderBottomEndRadius: 20,
  //           borderBottomLeftRadius: 20,
  //           position: 'absolute',
  //           zIndex: -999,
  //         }}>
  //         <Image
  //           source={require('src/assets/images/background.png')}
  //           style={{
  //             height: null,
  //             width: null,
  //             flex: 1,
  //             borderBottomEndRadius: 20,
  //             borderBottomLeftRadius: 20,
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //           marginTop: findHeight(40),
  //           marginHorizontal: 20,
  //         }}>
  //         <CustomButton
  //           onPress={() => {
  //             navigation?.goBack();
  //           }}
  //           style={{
  //             backgroundColor: '#D5A0FF',
  //             height: findHeight(43),
  //             width: findHeight(43),
  //             borderRadius: findSize(7),
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           <Image
  //             source={require('src/assets/images/back.png')}
  //             style={{
  //               backgroundColor: '#D5A0FF',
  //               height: 16,
  //               width: 11,
  //             }}
  //           />
  //         </CustomButton>
  //         <Text
  //           style={{
  //             fontSize: findSize(20),
  //             color: colors.defaultWhite,
  //             fontFamily: fonts.Philosopher,
  //           }}>
  //           Random Vocabulary
  //         </Text>
  //         <View
  //           style={{
  //             height: findSize(43),
  //             width: findSize(43),
  //           }}
  //         />
  //       </View>

  //       <View
  //         style={{
  //           backgroundColor: '#fff',
  //           marginTop: 80,
  //           paddingHorizontal: 20,
  //           flex: 1,
  //           flexDirection: 'row',
  //           flexWrap: 'wrap',
  //         }}>
  //         {data.map(item => (
  //           <View
  //             style={{
  //               backgroundColor: '#fff',
  //               padding: 10,
  //               borderRadius: 20,
  //               paddingHorizontal: 20,
  //               shadowOffset: {
  //                 height: 1,
  //                 width: 1,
  //               },
  //               shadowColor: 'gray',
  //               shadowOpacity: 0.8,
  //               alignSelf: 'flex-start',
  //               margin: 5,
  //             }}>
  //             <Text
  //               style={{
  //                 fontSize: findSize(13),
  //                 color: '#9E57D5',
  //                 fontFamily: fonts.Philosopher,
  //                 alignSelf: 'flex-start',
  //               }}>
  //               {capitalizeFirstLetter(item?.word ?? ' ')}
  //             </Text>
  //           </View>
  //         ))}
  //         <View
  //           style={{
  //             paddingVertical: 10,

  //             alignItems: 'flex-end',
  //             width: '100%',
  //             marginTop: 20,
  //           }}>
  //           <TouchableOpacity onPress={() => setMeaning(true)}>
  //             <Text
  //               style={{
  //                 fontFamily: fonts.Philosopher,
  //                 fontSize: 16,
  //                 color: colors.appVoilet,
  //                 fontWeight: 'bold',
  //               }}>
  //               See Meaning...
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //         <View style={{position: 'absolute', bottom: 20, end: 20}}>
  //           <TouchableOpacity
  //             style={{
  //               backgroundColor: colors.defaultWhite,
  //               borderRadius: 25,
  //               shadowOpacity: 0.5,

  //               shadowColor: colors.defaultBlack,
  //               shadowOffset: {
  //                 height: 2,
  //               },
  //               height: 50,
  //               width: 50,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //             }}
  //             onPress={() => {}}>
  //             <Ionicon name="add" size={30} color={colors.appVoilet} />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            backgroundColor: '#9E57D5',
            width: '100%',
            height: findHeight(140),
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
            Random Vocabulary
          </Text>
          <View
            style={{
              height: findSize(43),
              width: findSize(43),
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 80,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[...randomWords]}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '39%',
                    marginEnd: '2%',
                  }}>
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
                    }}>
                    <Text
                      style={{
                        fontSize: findSize(13),
                        color: '#9E57D5',
                        fontFamily: fonts.Philosopher,
                        alignSelf: 'flex-start',
                      }}>
                      {capitalizeFirstLetter(data?.[0]?.word_type ?? 'word')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '59%',
                    marginEnd: '2%',
                  }}>
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
                    }}>
                    <Text
                      style={{
                        fontSize: findSize(13),
                        color: '#9E57D5',
                        fontFamily: fonts.Philosopher,
                        alignSelf: 'flex-start',
                      }}>
                      Meaning
                    </Text>
                  </View>
                </View>
              </View>
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            )}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={(item, index) => index?.toString()}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 0.8,
                  width: '100%',
                  alignSelf: 'center',
                  backgroundColor: '#DEDEDE',
                }}
              />
            )}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);

              getVocabData();
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default RandomVocab;

const styles = StyleSheet.create({});
