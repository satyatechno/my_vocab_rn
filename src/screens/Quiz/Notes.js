import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  AppState,
  Image,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import colors from 'src/styles/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import fonts from 'src/styles/texts/fonts';
import {
  addNewNote,
  setNotesData,
  updateNote,
} from 'src/redux/reducers/notesReducer';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WebView from 'react-native-webview';
import {capitalizeFirstLetter, findHeight, findSize} from 'src/helper/helper';
import CustomButton from 'src/components/customButton/CustomButton';
import {addRandomWord} from 'src/redux/reducers/reducer';
import SwipeableFlatList from 'react-native-swipeable-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import {successToast} from 'src/utils/toast';
import Tooltip from 'react-native-walkthrough-tooltip';

const Notes = ({navigation}) => {
  const notesData = useSelector(state => state?.notesReducer?.notesData);
  const randomWords = useSelector(state => state?.reducer?.randomWords);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMorePage, setHasMorePage] = useState(false);
  const [toolTipId, setToolTipId] = useState(null);
  const [page, setPage] = useState(1);
  const [note, setNote] = useState('');

  const richText = React.useRef();
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      getVocabData();
      getNotes();
    }, []),
  );
  useEffect(() => {}, []);
  const getNotes = async () => {
    setLoading(true);
    await axios
      .get('http://word-app.pairroxz.in/api/notes')
      .then(res => {
        console.log('all', res.data);
        dispatch(setNotesData(res.data?.data?.notes));

        setHasMorePage(
          res?.data?.meta?.current_page < res?.data?.meta?.total_page,
        );
      })
      .catch(e => {})
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };
  const deleteNote = async id => {
    dispatch(setNotesData(notesData?.filter(x => x.id !== id)));
    await axios
      .delete(`http://word-app.pairroxz.in/api/notes/delete/${id}`)
      .then(res => {})
      .catch(e => {})
      .finally(() => {
        setDeleteId(null);
      });
  };
  const onSubmit = async () => {
    if (editId === null) {
      if (note?.length) {
        dispatch(addNewNote({id: null, notes: note}));
        await axios
          .post('http://word-app.pairroxz.in/api/notes', {notes: note})
          .then(res => {})
          .catch(e => {})
          .finally(() => {
            setModalVisible(false);
            setNote('');
            setDeleteId(null);
            setEditId(null);
            getNotes();
          });
      } else {
        setNote('');
        setDeleteId(null);
        setEditId(null);
        setModalVisible(false);
      }
    } else {
      if (note?.length) {
        let tempItem = notesData?.find(x => x.id === editId);
        dispatch(updateNote({...tempItem, notes: note}));
        await axios
          .post(`http://word-app.pairroxz.in/api/notes/update/${editId}`, {
            notes: note,
          })
          .then(res => {})
          .catch(e => {})
          .finally(() => {
            setModalVisible(false);
            setNote('');
            setDeleteId(null);
            setEditId(null);
            getNotes();
          });
      } else {
        setNote('');
        setDeleteId(null);
        setEditId(null);
        setModalVisible(false);
      }
    }
  };

  const onMoreLoad = async page => {
    await axios
      .get('http://word-app.pairroxz.in/api/notes', {
        params: {
          page: page,
        },
      })
      .then(res => {
        dispatch(setNotesData([...notesData, ...res.data?.data?.notes]));
        setHasMorePage(
          res?.data?.meta?.current_page < res?.data?.meta?.total_page,
        );
        setPage(page);
      })
      .catch(e => {})
      .finally(() => {
        setMoreLoading();
      });
  };

  const getVocabData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        'http://word-app.pairroxz.in/api/words/random',
      );
      console.log('dada', res.data.data);
      dispatch(addRandomWord([...res.data?.data?.words]));

      setLoading(false);
    } catch (e) {
      setLoading(false);

      console.log('error data', e);
    } finally {
      getNotes();
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: colors.defaultWhite,
          paddingHorizontal: 12,
          borderRadius: 5,
          shadowOpacity: 0.3,
          shadowColor: colors.defaultBlack,
          shadowOffset: {
            height: 1,
          },

          marginHorizontal: 15,
        }}>
        <TouchableOpacity
          // onLongPress={() => {
          //   setDeleteId(item?.id);
          // }}
          onPress={() => {
            setDeleteId(null);
            setEditId(item?.id);
            setModalVisible(true);
            setNote(item?.notes);
            setTimeout(() => {
              richText?.current.insertHTML(item?.notes);
            }, 500);
          }}
          style={{
            position: 'absolute',
            zIndex: 10,
            height: '100%',
            width: '100%',
          }}></TouchableOpacity>
        <WebView
          style={{height: 50}}
          source={{
            html: `<head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body>${item?.notes}</body></html>`,
          }}
          scrollEnabled={false}
        />
        {console.log('first', item)}
        <Text
          style={{
            color: colors.appGray,
            fontFamily: fonts.Philosopher,
            marginBottom: 5,
            paddingHorizontal: 5,
          }}>
          {item?.created_at}
        </Text>
        {deleteId === item?.id ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete',
                'Are you sure, you want to delete this note.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                      console.log('delete cancel');
                      setDeleteId(null);
                    },
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      deleteNote();
                    },
                  },
                ],
              );
            }}
            style={{
              backgroundColor: colors.appRed,
              padding: 4,
              borderRadius: 5,
            }}>
            <AntDesign name="delete" color={colors.defaultWhite} size={23} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  if ((!notesData?.length || !randomWords?.length) && loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={'large'} color={colors.appVoilet} />
      </View>
    );
  }

  // if (randomWords?.length == 0) {
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
  const QuickActions = (index, qaItem) => {
    return (
      <View
        style={{
          alignSelf: 'flex-end',

          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginEnd: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete',
              'Are you sure, you want to delete this note.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    console.log('delete cancel');
                    // setDeleteId(null);
                  },
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    deleteNote(qaItem?.id);
                  },
                },
              ],
            );
          }}
          style={{
            backgroundColor: colors.appRed,
            padding: 4,
            borderRadius: 5,
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="delete" color={colors.defaultWhite} size={23} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <View style={{flex: 1, backgroundColor: colors.defaultWhite}}>
        <SwipeableFlatList
          keyExtractor={item => item?.id?.toString()}
          maxSwipeDistance={80}
          renderQuickActions={({index, item}) => QuickActions(index, item)}
          contentContainerStyle={{flexGrow: 1}}
          data={notesData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: colors.appGray1,
                width: '90%',
                height: 1,
                alignSelf: 'center',
                marginVertical: 5,
              }}
            />
          )}
          ListHeaderComponent={
            <View>
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
                  <CustomButton
                    onPress={() => {
                      getVocabData();
                    }}
                    style={{
                      backgroundColor: '#D5A0FF',
                      height: findHeight(43),
                      width: findHeight(43),
                      borderRadius: findSize(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator
                        color={colors.defaultWhite}
                        size="small"
                      />
                    ) : (
                      <Ionicons
                        name="refresh"
                        size={25}
                        color={colors.defaultWhite}
                      />
                    )}
                  </CustomButton>
                </View>

                <View
                  style={{
                    backgroundColor: '#fff',
                    marginTop: 80,
                    paddingHorizontal: 20,
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {randomWords?.map(item => (
                    <Tooltip
                      isVisible={item?.id == toolTipId}
                      key={item?.id}
                      content={
                        <View>
                          <Text
                            style={{
                              fontFamily: fonts.Philosopher,
                              fontSize: 13,
                              color: colors.defaultBlack,
                            }}>
                            {item?.answer?.word_meaning}
                          </Text>
                          {item?.answer?.example?.length > 0 ? (
                            <Text
                              style={{
                                fontFamily: fonts.Philosopher,
                                fontSize: 12,
                                color: colors.appGray,
                              }}>
                              {console.log('itemm', item)}
                              Ex. {item?.answer?.example}
                            </Text>
                          ) : null}
                        </View>
                      }
                      placement="bottom"
                      onClose={() => {
                        setToolTipId(null);
                      }}>
                      <TouchableOpacity
                        onPress={() => setToolTipId(item?.id)}
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
                          {capitalizeFirstLetter(item?.word ?? ' ')}
                        </Text>
                      </TouchableOpacity>
                    </Tooltip>
                  ))}
                  <View
                    style={{
                      paddingVertical: 10,

                      alignItems: 'flex-end',
                      width: '100%',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        let RANDOM_WORDS = randomWords
                          ?.map(item =>
                            capitalizeFirstLetter(item?.word ?? ' '),
                          )
                          ?.join();
                        Clipboard.setString(RANDOM_WORDS);
                        successToast('Copied');
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.Philosopher,
                          fontSize: 16,
                          color: colors.appVoilet,
                          fontWeight: 'bold',
                        }}>
                        <AntDesign name="copy1" color={'#9E57D5'} size={20} />{' '}
                        Copy words
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
              <View
                style={{
                  alignItems: 'flex-start',
                  backgroundColor: colors.defaultWhite,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // navigation?.openDrawer();
                  }}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingStart: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fonts.Philosopher,
                      color: colors.defaultBlack,
                      fontWeight: 'bold',
                      margin: 15,
                      marginStart: 0,
                    }}>
                    Notes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.defaultBlack,
                  fontFamily: fonts.Philosopher,
                  fontSize: 16,
                  marginBottom: 20,
                }}>
                {' '}
                You have no notes{' '}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.appVoilet,
                  padding: 10,
                  borderRadius: 10,
                  shadowOpacity: 0.5,

                  shadowColor: colors.defaultBlack,
                  shadowOffset: {
                    height: 2,
                  },
                }}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Text
                  style={{
                    color: colors.defaultWhite,
                    fontFamily: fonts.Philosopher,
                    fontSize: 14,
                  }}>
                  Add Notes
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={() => {
            if (moreLoading) {
              return (
                <View
                  style={{
                    height: 75,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'small'} color={colors.appVoilet} />
                </View>
              );
            } else {
              return <View />;
            }
          }}
          stickyHeaderIndices={[0]}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setPage(1);
            getNotes();
          }}
          onEndReached={() => {
            if (hasMorePage) onMoreLoad(page + 1);
          }}
        />
        <View style={{position: 'absolute', bottom: 20, end: 20}}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.defaultWhite,
              borderRadius: 25,
              shadowOpacity: 0.5,

              shadowColor: colors.defaultBlack,
              shadowOffset: {
                height: 2,
              },
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Ionicon name="add" size={30} color={colors.appVoilet} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={modalVisible}
        style={{
          margin: 0,
          backgroundColor: colors.defaultWhite,
          flex: 1,
          justifyContent: 'flex-start',
          paddingTop: Platform.OS === 'ios' ? 35 : 0,
        }}
        onDismiss={() => {
          onSubmit();
        }}
        onLayout={() => {
          setTimeout(() => {
            richText?.current?.focusContentEditor();
          }, 500);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            backgroundColor: colors.defaultWhite,
            borderBottomWidth: 1,
            borderBottomColor: colors.appGray1,
            height: 50,
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Ionicon
              name="chevron-back"
              size={20}
              color={colors.defaultBlack}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.Philosopher,
                color: colors.defaultBlack,
                fontWeight: 'bold',
              }}>
              Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.Philosopher,
                color: colors.defaultBlack,
                fontWeight: 'bold',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            richText?.current?.focusContentEditor();
          }}>
          <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.defaultWhite}}
            behavior="padding">
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{flex: 1}}>
                <RichEditor
                  ref={richText}
                  onChange={descriptionText => {
                    setNote(descriptionText);
                  }}
                  editorStyle={{backgroundColor: colors.defaultWhite}}
                />
              </View>
            </ScrollView>
            <View
              style={{
                backgroundColor: colors.defaultWhite,
              }}>
              <RichToolbar
                editor={richText}
                selectedIconTint={colors.appVoilet}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                ]}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Notes;

const styles = StyleSheet.create({});
