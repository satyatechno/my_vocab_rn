import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export const errorToast = message => {
  if (message) {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: message,
      text2: null,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: Platform.OS==="ios"?45 :10,
      onPress: () => Toast.hide(),
    });
  }
};

export const successToast = message => {
  if (message) {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: message,
      text2: null,
      visibilityTime: 2500,
      autoHide: true,
      topOffset: Platform.OS==="ios"?45 :10,
    });
  }
};
