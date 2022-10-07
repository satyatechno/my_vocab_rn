import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const CustomButton = ({
  onPress,
  title,
  type,
  style,
  isLoading,
  disabled,
  loaderSize = findSize(30),
  loaderColor = colors.defaultWhite,
  textStyle,
  children,
  activeOpacity = 0.6,
  ...rest
}) => {
  const [multiTab, setMultiTab] = useState(false);

  const btnStyle = value => {
    switch (value) {
      case 1:
        return styles.fillButton;
      case 2:
        return styles.borderButton;
      default:
        return {};
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={isLoading || multiTab || disabled}
      onPress={() => {
        setMultiTab(true);
        onPress();
      }}
      style={[btnStyle(type), style]}
      onPressOut={() => {
        setTimeout(() => {
          setMultiTab(false);
        }, 200);
      }}
      {...rest}>
      {[1, 2].includes(type) ? (
        isLoading ? (
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        ) : (
          <Text
            style={[
              styles.titleStyle,
              {color: type == 2 ? colors.themeColor : colors.defaultWhite},
              textStyle,
            ]}>
            {title}
          </Text>
        )
      ) : null}
      {!type && children}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  fillButton: {
    backgroundColor: colors.themeColor,
    height: findHeight(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: findHeight(30),
    width: '100%',
    marginVertical: findSize(10),
  },
  borderButton: {
    backgroundColor: colors.defaultWhite,
    height: findHeight(55),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: findHeight(30),
    width: '100%',
    marginVertical: findSize(10),
    borderWidth: 1.5,
    borderColor: colors.themeColor,
  },
  titleStyle: {
    fontSize: findSize(20),
    color: colors.defaultWhite,
    textAlign: 'center',
    fontFamily: fonts.Montserrat_Medium,
  },
});
