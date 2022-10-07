import 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DEVICE_WIDTH} from 'src/helper/helper';
import DrawerQuiz from 'src/navigation/DrawerQuiz';
import colors from 'src/styles/colors/colors';
import TouchPrevent from 'src/components/touchPrevent/TouchPrevent';
import {persistor, store} from 'src/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

const toastConfig = {
  success: ({text1, props, ...rest}) => (
    <View
      style={{
        height: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.themeColor,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.lightGreen,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16, flex: 1}}>{text1}</Text>
      <Text>{props.guid}</Text>
      <Ionicons onPress={() => Toast.hide()} name="close" size={20} />
    </View>
  ),
  error: ({text1, onPress, props, ...rest}) => (
    <View
      style={{
        height: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.appRed,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.appRed,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16, flex: 1}}>{text1}</Text>
      <Text>{props.guid}</Text>
      <Ionicons onPress={onPress} name="close" size={20} />
    </View>
  ),
  info: () => {},
  network: ({text1, onPress, props, ...rest}) => (
    <View
      style={{
        height: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.appRed,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.appRed,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16}}>{text1}</Text>
      <Text>{props.guid}</Text>
    </View>
  ),
};
export default function App() {
  const [showNetwork, setShowNetwork] = useState();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setShowNetwork(true);
      } else {
        setShowNetwork(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'#9E57D5'}
        // backgroundColor={colors.defaultWhite}
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <SafeAreaView style={{backgroundColor: '#9E57D5'}}></SafeAreaView>
            <SafeAreaView style={{flex: 1}}>
              <TouchPrevent>
                <DrawerQuiz />
              </TouchPrevent>
            </SafeAreaView>
            <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
            {showNetwork ? (
              <View
                style={{
                  position: 'absolute',
                  height: 50,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  width: DEVICE_WIDTH,
                }}>
                <Text
                  style={{
                    color: colors.defaultWhite,
                    textAlign: 'center',
                  }}>
                  No Internet Connection
                </Text>
              </View>
            ) : null}
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </>
  );
}
