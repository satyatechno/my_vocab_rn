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
import {setWordData} from 'src/redux/reducers/reducer';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CancelToken = axios.CancelToken;
export let searchApiToken = null;
const Item = ({item, onSelect, seleted, onDelete, navigation}) => {
  return (
    <>
      <TouchableOpacity
        // activeOpacity={1}

        onPress={() => {
          if (item?.id == seleted) {
            onSelect('');
          } else {
            onSelect(item?.id);
          }
        }}
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
      {seleted === item?.id ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            alignSelf: 'flex-end',
            marginBottom: 10,
          }}>
          <CustomButton
            style={{marginEnd: 20}}
            onPress={() => {
              onSelect('');
              navigation?.navigate('EditWord', {item: item});
            }}>
            <Text style={{color: '#9E57D5', fontFamily: fonts.Philosopher}}>
              Edit <AntDesign name="edit" size={14} color={'#9E57D5'} />
            </Text>
          </CustomButton>
          <CustomButton
            onPress={() => {
              Alert.alert(
                'Delete',
                'Are you sure, you want to delete this word ',
                [
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      onSelect('');
                      onDelete(item?.id);
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {},
                  },
                ],
              );
            }}>
            <Text style={{color: 'red', fontFamily: fonts.Philosopher}}>
              delete <AntDesign name="delete" size={14} color={'red'} />
            </Text>
          </CustomButton>
        </View>
      ) : null}
    </>
  );
};
const AllVocab = ({navigation}) => {
  const data = useSelector(state => state?.reducer?.wordData);
  const totalWords = useSelector(state => state?.reducer?.total);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [quickWords, setQuickWords] = useState([]);
  // const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState();
  const [page, setpage] = useState(1);
  const [hasMorePage, sethasMorePage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollMoment, setscrollMoment] = useState(true);
  const [quickCount, setQuickCount] = useState(0);
  const [seleted, setSeleted] = useState('');
  const [search, setSearch] = useState('');

  const [selectedFilter, setSelectedFilter] = useState({
    days_filter: '',
    word_types: '',
  });

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getVocabData(1);
      getFilterData();
      setSelectedFilter({
        days_filter: '',
        word_types: '',
      });
    }, []),
  );

  const getVocabData = async (page = 1, filter = selectedFilter) => {
    try {
      if (page > 1) {
        setPageLoading(true);
      } else {
        if (!refreshing) setLoading(true);
      }
      if (searchApiToken !== null) {
        searchApiToken('cancel');
      }
      const res = await axios.get('http://word-app.pairroxz.in/api/words', {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          searchApiToken = c;
        }),
        params: {
          word_type: filter?.word_types,
          date_range: filter?.days_filter,
          page: page,
          q: search,
        },
      });
      if (page > 1) {
        console.log('page ', page);
        dispatch(
          setWordData({
            data: [...data, ...res.data?.data?.words],
            total: res?.data?.meta?.total_item,
          }),
        );
        // setData([...data, ...res.data?.data?.words]);
      } else {
        dispatch(
          setWordData({
            data: [...res.data?.data?.words],
            total: res?.data?.meta?.total_item,
          }),
        );
      }
      sethasMorePage(res.data?.meta?.current_page < res.data?.meta?.total_page);
      // setTotalData(res?.data?.meta?.total_item);
      setQuickCount(res.data?.data?.counts);
      setLoading(false);
      setPageLoading(false);
      setRefreshing(false);
    } catch (e) {
      setLoading(false);
      setPageLoading(false);
      setRefreshing(false);
      console.log('error data', e);
    }
  };
  const getFilterData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://word-app.pairroxz.in/api/filters',
        {},
      );
      setFilterData({...res.data?.data});

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('error', e);
    }
  };
  const getQuickWords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://word-app.pairroxz.in/api/no-meanings-words',
        {},
      );
      setQuickWords([...res.data?.data?.words]);
      setModalVisible1(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('error', e);
    }
  };
  const onDelete = async id => {
    try {
      PreventTouch(true, true);
      const res = await axios.delete(
        `http://word-app.pairroxz.in/api/words/delete/${id}`,
      );
      console.log('response', res?.data);

      dispatch(
        setWordData({
          data: [...data?.filter(x => x?.id !== id)],
          total: totalWords - 1,
        }),
      );

      successToast(res?.data?.message);
    } catch (e) {
      console.log('error delete', e?.response?.data);
    } finally {
      PreventTouch(false, false);
    }
  };

  useEffect(() => {
    getVocabData(1, selectedFilter);
  }, [search]);

  if (loading && data?.length == 0 && search?.length == 0) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            backgroundColor: '#9E57D5',
            width: '100%',
            height: findHeight(180),
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
            marginVertical: findHeight(40),
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
            All Vocabulary
          </Text>
          <View
            style={{
              height: findSize(43),
              width: findSize(43),
            }}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={'#9E57D5'} size={'large'} />
        </View>
      </SafeAreaView>
    );
  }
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
            All Vocabulary
          </Text>
          {quickCount > 0 ? (
            <CustomButton
              onPress={() => {
                getQuickWords();
              }}
              style={{
                backgroundColor: '#D5A0FF',
                height: findHeight(43),
                width: findHeight(43),
                borderRadius: findSize(7),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="md-flash-sharp"
                size={25}
                color={colors.defaultWhite}
              />
              <View
                style={{
                  position: 'absolute',
                  height: 22,
                  width: 22,
                  borderRadius: 11,
                  backgroundColor: 'red',
                  top: -10,
                  left: -10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.defaultWhite,
                    fontSize: 14,
                    fontFamily: fonts.Philosopher,
                  }}>
                  {quickCount}
                </Text>
              </View>
            </CustomButton>
          ) : (
            <View
              style={{
                height: findHeight(43),
                width: findHeight(43),
              }}></View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{width: 90}}></View>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: fonts.Philosopher,
            }}>
            {totalWords}
          </Text>
          <CustomButton
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              width: 70,
              height: 30,
              paddingHorizontal: 10,
              borderRadius: 5,
              alignSelf: 'flex-end',
              marginEnd: 20,
            }}>
            <Image
              style={{height: 14, width: 14}}
              source={require('src/assets/images/filter.png')}
            />
            <Text
              style={{
                color: '#9E57D5',
                fontSize: 12,
                marginStart: 4,
                fontFamily: fonts.Philosopher,
              }}>
              Filter
            </Text>
          </CustomButton>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 50,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <View>
            <View
              style={{
                margin: 5,
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
                value={search}
                placeholder="Search your word"
                placeholderTextColor={colors.appGray2}
                onChangeText={text => {
                  setSearch(text);
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
                {search ? (
                  <CustomButton
                    onPress={() => {
                      setSearch('');
                    }}
                    style={{
                      backgroundColor: colors?.appGray1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      padding: 5,
                    }}>
                    <AntDesign name="close" size={18} color={colors.appGray} />
                  </CustomButton>
                ) : null}
              </View>
            </View>
          </View>
          <FlatList
            // style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={[...data]}
            ListEmptyComponent={() => (
              <View
                style={{justifyContent: 'center', alignItems: 'center'}}></View>
            )}
            renderItem={({item}) => (
              <Item
                seleted={seleted}
                onSelect={id => {
                  setSeleted(id);
                }}
                item={item}
                onDelete={onDelete}
                navigation={navigation}
              />
            )}
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
            onMomentumScrollBegin={() => {
              setscrollMoment(false);
            }}
            onEndReached={() => {
              if (!scrollMoment) {
                if (hasMorePage) {
                  getVocabData(page + 1, selectedFilter);
                  setpage(page + 1);
                  setscrollMoment(true);
                }
              }
            }}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setpage(1);
              getVocabData(1, selectedFilter);
              getFilterData();
            }}
            ListFooterComponent={() => {
              if (pageLoading) {
                return (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color={'#9E57D5'} size="small" />
                  </View>
                );
              } else return null;
            }}
          />
        </View>
      </SafeAreaView>
      <Modal
        isVisible={modalVisible}
        hasBackdrop={false}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          backgroundColor: 'rgba(134, 118, 105, 0.3)',
          margin: 0,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 10,
          }}>
          {[
            {
              id: 'days_filter',
              name: 'Days Filter',
              value: filterData?.days_filter,
            },
            {
              id: 'word_types',
              name: 'Word Types',
              value: filterData?.word_types,
            },
          ]?.map(item =>
            item?.value?.length ? (
              <View key={item?.id}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    marginTop: 10,
                    fontFamily: fonts.Philosopher,
                  }}>
                  {item?.name}
                </Text>
                {item?.value?.map(filter => (
                  <CustomButton
                    key={filter?.id}
                    onPress={() => {
                      setSelectedFilter({
                        ...selectedFilter,
                        [item?.id]: filter?.id,
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                      padding: findHeight(10),
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor:
                        selectedFilter?.[item?.id] === filter?.id
                          ? '#9E57D5'
                          : 'lightgray',
                      marginVertical: 5,
                      borderRadius: 4,
                    }}>
                    <Text
                      style={{
                        fontSize: findSize(15),
                        color: colors.defaultWhite,
                        fontFamily: fonts.Philosopher,
                        marginHorizontal: '1%',
                        color: '#000',
                        flex: 1,
                      }}>
                      {filter?.text}
                    </Text>
                    <View
                      style={{
                        height: 18,
                        width: 18,
                        borderRadius: 9,
                        justifyContent: 'center',
                        alignItems: 'center',

                        backgroundColor:
                          selectedFilter?.[item?.id] === filter?.id
                            ? '#fff'
                            : 'lightgray',
                        marginHorizontal: 7,
                      }}>
                      {selectedFilter?.[item?.id] === filter?.id ? (
                        <Image
                          source={require('src/assets/images/check.png')}
                          style={{height: 16, width: 16}}
                        />
                      ) : null}
                    </View>
                  </CustomButton>
                ))}
              </View>
            ) : null,
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <CustomButton
              type={1}
              title="Submit"
              onPress={() => {
                getVocabData(1, selectedFilter);
                setModalVisible(false);
              }}
              style={{
                backgroundColor: '#9E57D5',
                width: '35%',
                height: 40,
                alignSelf: 'center',
              }}
              textStyle={{fontSize: 15, fontFamily: fonts.Philosopher}}
            />
            <CustomButton
              type={2}
              title="Clear"
              onPress={() => {
                setSelectedFilter(() => ({days_filter: '', word_types: ''}));

                getVocabData(1, {days_filter: '', word_types: ''});

                setModalVisible(false);
              }}
              style={{
                borderColor: '#9E57D5',
                width: '35%',
                height: 40,
                alignSelf: 'center',
              }}
              textStyle={{color: '#9E57D5', fontSize: 15}}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={modalVisible1}
        hasBackdrop={false}
        onBackButtonPress={() => setModalVisible1(false)}
        onBackdropPress={() => setModalVisible1(false)}
        style={{
          backgroundColor: 'rgba(134, 118, 105, 0.3)',
          margin: 0,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#9E57D5',
                fontSize: 16,
                textAlign: 'center',
                fontFamily: fonts.Philosopher,
                alignSelf: 'center',
              }}>
              Quick Words
            </Text>
            <CustomButton
              onPress={() => {
                setModalVisible1(false);
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
          </View>
          <View style={{paddingVertical: 10}}>
            <FlatList
              data={[...quickWords]}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: colors.defaultBlack,
                        fontSize: 14,

                        fontFamily: fonts.Philosopher,

                        flex: 1,
                      }}>
                      {item?.word}
                    </Text>
                    <CustomButton
                      onPress={() => {
                        setModalVisible1(false);
                        navigation?.navigate('EditWord', {item: item});
                      }}
                      style={{
                        backgroundColor: colors?.appGray,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                      }}>
                      <Text
                        style={{
                          color: colors.defaultWhite,
                          fontSize: 11,
                          textAlign: 'center',
                          fontFamily: fonts.Philosopher,
                          alignSelf: 'center',
                        }}>
                        Add Meaning
                      </Text>
                    </CustomButton>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AllVocab;

const styles = StyleSheet.create({});
