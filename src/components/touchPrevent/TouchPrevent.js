import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
export let PreventTouch = null;
const TouchPrevent = ({children}) => {
  const [show, setShow] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const toggle = value => {
    setShow(value);
  };
  useEffect(() => {
    PreventTouch = (value, visibleIndicator) => {
      setShow(value);
      setIndicator(visibleIndicator);
    };
  }, []);
  return (
    <View style={{flex: 1}}>
      {children}
      {show && (
        <View
          style={{
            height: DEVICE_HEIGHT,
            position: 'absolute',
            backgroundColor: 'transparent',
            width: DEVICE_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {indicator && <ActivityIndicator size={'large'} color={'#9E57D5'} />}
        </View>
      )}
    </View>
  );
};

export default TouchPrevent;

const styles = StyleSheet.create({});
