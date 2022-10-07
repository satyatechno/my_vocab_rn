import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import colors from 'src/styles/colors/colors';
import CustomButton from 'src/components/customButton/CustomButton';
import fonts from 'src/styles/texts/fonts';
import {findHeight, findSize} from 'src/helper/helper';
import axios from 'axios';
const TYPES = [
  {id: 'word', text: 'Word'},
  {id: 'idiom', text: 'Idioms'},
  {id: 'phrase', text: 'Phrase'},
];
const NO_OF_QUE = [
  {id: 10, text: '10 Qns'},
  {id: 15, text: '15 Qns'},
  {id: 20, text: '20 Qns'},
];
const Quiz = ({navigation}) => {
  const [type, setType] = useState([]);
  const [queNo, setQueNo] = useState(10);
  const [loading, setLoading] = useState(10);

  const getQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://word-app.pairroxz.in/api/quiz', {
        word_types: type,
        limit: queNo,
      });
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
  const onPlay = () => {
    if (type.length) {
      navigation?.navigate('PlayQuiz', {type: type, limit: queNo});
    } else {
      alert('Please choose preference');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.defaultWhite,
      }}>
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
          Quiz
        </Text>

        <View
          style={{
            height: findHeight(43),
            width: findHeight(43),
          }}></View>
      </View>
      <View style={{paddingTop: 30}}>
        <Text style={styles.heading}>Choose Your Preference</Text>
        <View style={styles.checkContainer}>
          {TYPES.map(item => (
            <CustomButton
              onPress={() => {
                if (type?.includes(item.id)) {
                  setType(prev => prev.filter(x => x !== item?.id));
                } else {
                  setType(prev => [...prev, item.id]);
                }
              }}
              key={item?.id}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={[
                  styles.check,
                  {
                    borderWidth: type?.includes(item.id) ? 0 : 1,
                  },
                ]}>
                {type?.includes(item.id) ? (
                  <Image
                    style={{height: 18, width: 18, resizeMode: 'contain'}}
                    source={require('src/assets/images/check.png')}
                  />
                ) : null}
              </View>
              <Text style={styles.title}>{item.text}</Text>
            </CustomButton>
          ))}
        </View>
        <Text style={styles.heading}>Choose Number of Questions</Text>
        <View style={styles.checkContainer}>
          {NO_OF_QUE.map(item => (
            <CustomButton
              onPress={() => {
                setQueNo(item.id);
              }}
              key={item?.id}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={[
                  styles.check,
                  {
                    borderWidth: queNo == item.id ? 0 : 1,
                  },
                ]}>
                {queNo == item.id ? (
                  <Image
                    style={{height: 18, width: 18, resizeMode: 'contain'}}
                    source={require('src/assets/images/check.png')}
                  />
                ) : null}
              </View>
              <Text style={styles.title}>{item.text}</Text>
            </CustomButton>
          ))}
        </View>
        <CustomButton
          type={1}
          title="Play"
          isLoading={false}
          onPress={() => {
            onPlay();
          }}
          style={{
            backgroundColor: '#9E57D5',
            width: '40%',
            height: 40,
            alignSelf: 'center',
            marginTop: 40,
          }}
          textStyle={{fontSize: 15, fontFamily: fonts.Philosopher}}
        />
      </View>
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  heading: {
    color: colors.defaultBlack,
    fontSize: 16,
    fontFamily: fonts.Philosopher,
    marginTop: 40,
    marginStart: 10,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: findHeight(10),
    width: '75%',
  },
  check: {
    height: 18,
    width: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    backgroundColor: '#fff',
    marginHorizontal: 7,
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontFamily: fonts.Philosopher,
  },
});
