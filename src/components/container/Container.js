import React, {ReactNode, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import colors from 'src/styles/colors/colors';

const Container = ({
  style,
  flex,
  statusBarColor,
  children,
  contentContainerStyle,
  stickyHeaderHiddenOnScroll = false,
  stickyHeader = false,
  refreshControl,
  bounces,
}) => {
  const [isKeyBoardOpen, setIsKeyBoardOpen] = useState(false);
  const _keyboardDidShow = () => {
    setIsKeyBoardOpen(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyBoardOpen(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      contentContainerStyle={{flexGrow: 1}}
      enabled={Platform.OS === 'android' ? false : true}
      behavior={Platform.OS === 'android' ? 'padding' : 'padding'}
      style={[
        {
          flex: 1,
        },
        style,
      ]}>
      <SafeAreaView
        style={[style, {flex: 1, backgroundColor: colors.defaultWhite}]}>
        <StatusBar
          translucent={false}
          backgroundColor={statusBarColor ?? colors.defaultWhite}
          barStyle="dark-content"
        />
        <ScrollView
          // canCancelContentTouches={false}
          scrollToOverflowEnabled={true}
          keyboardShouldPersistTaps="handled"
          bounces={bounces ?? false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[contentContainerStyle, {flexGrow: 1}]}
          stickyHeaderIndices={stickyHeader ? [0] : []}
          stickyHeaderHiddenOnScroll={stickyHeaderHiddenOnScroll}
          style={[
            style,
            !flex && {flex: 1, backgroundColor: colors.defaultWhite},
          ]}
          refreshControl={refreshControl ?? null}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Container;
