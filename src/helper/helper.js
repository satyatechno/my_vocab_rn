import {Dimensions, StatusBar} from 'react-native';

export const BUILD_VERSION = 'v0.08';
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const findHeight = height => {
  return (DEVICE_HEIGHT / 856) * height;
};

export const findWidth = width => {
  return (DEVICE_WIDTH / 414) * width;
};
export const findSize = width => {
  return (DEVICE_WIDTH / 414) * width + 1.5;
};
export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
