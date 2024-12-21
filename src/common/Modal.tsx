import React from 'react';
import {StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';

import {colors} from '../theme/colors';
import {AppText, SIXTEEN} from './AppText';
import {FONTS} from '../theme/colors';
import {Button} from 'react-native-paper';

interface RemoveModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  title: string;
  cb: () => void;
}

const Modal = ({isVisible, setIsVisible, title, cb}: RemoveModalProps) => {
  const onPressNo = () => {
    setIsVisible(false);
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}>
      <View style={styles.modalContainer}>
        <AppText style={styles.title} type={SIXTEEN}>
          {title}
        </AppText>
        <View style={styles.buttonContainer}>
          <Button labelStyle={styles.buttonTitle} onPress={cb}>
            Confirm
          </Button>
          <Button labelStyle={styles.buttonTitle} onPress={onPressNo}>
            Cancel
          </Button>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    padding: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonTitle: {
    color: colors.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  title: {
    textAlign: 'center',
    fontFamily: FONTS.Medium,
  },
});
