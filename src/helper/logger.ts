import Toast from 'react-native-simple-toast';

export const logError = (error: any) => {
  console.log(error);
};

export const showError = (err: any) => {
  let temp = err?.toString();
  Toast.showWithGravity(temp, Toast.LONG, Toast.BOTTOM);
};
