import React, {useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  Button,
  FOURTEEN,
  KeyBoardAware,
  SEMI_BOLD,
  TWENTY,
  TouchableOpacityView,
} from '../common';
import Toolbar from '../common/Toolbar';
import {OtpInput} from 'react-native-otp-entry';
import {colors} from '../theme/colors';
import {Image, StyleSheet, View} from 'react-native';
import {fontFamilyBold} from '../theme/typography';
import {messageIcon, phoneIcon, whatsappIcon} from '../helper/ImageAssets';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {ReSendOtp, verifyOtp} from '../actions/authActions';
import FastImage from 'react-native-fast-image';

const OtpVerify = () => {
  const dispatch = useAppDispatch();
  const {isLoading, userData} = useAppSelector(state => state.auth);
  const {_id} = userData ?? '';
  const [otp, setOtp] = useState<string>('');

  const onSubmit = () => {
    let data = {
      userId: _id,
      otp: otp,
    };
    dispatch(verifyOtp(data));
  };

  const onResend = () => {
    let data = {user_id: _id, flag: 'p', resend: true};
    dispatch(ReSendOtp(data));
  };

  return (
    <AppSafeAreaView>
      <Toolbar isSecond />
      <KeyBoardAware>
        <>
          <AppText type={TWENTY} weight={SEMI_BOLD}>
            Enter the OTP sent to {userData?.phone}
          </AppText>
          <OtpInput
            numberOfDigits={6}
            focusColor={colors.primary}
            onTextChange={code => {
              setOtp(code);
            }}
            theme={{
              containerStyle: styles.otpContainer,
              inputsContainerStyle: styles.inputsContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
          <Button
            children="Continue"
            onPress={() => onSubmit()}
            disabled={otp.length !== 6}
            loading={isLoading}
          />
          <View style={styles.bottomContainer}>
            <AppText type={FOURTEEN}>Didn’t receive it? Retry via</AppText>
            <View style={styles.resendContainer}>
              {/* <TouchableOpacityView>
                <FastImage
                  source={whatsappIcon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </TouchableOpacityView> */}
              <TouchableOpacityView onPress={() => onResend()}>
                <FastImage
                  source={messageIcon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </TouchableOpacityView>
              {/* <TouchableOpacityView> */}
              {/* <FastImage
                  source={phoneIcon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </TouchableOpacityView> */}
            </View>
          </View>
        </>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default OtpVerify;
const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
  },
  inputsContainer: {
    // color: colors.black,
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderColor: colors.lightPink_third,
    borderRadius: 4,
    padding: 1,
    height: 40,
    marginTop: 20,
  },
  pinCodeText: {
    fontSize: 24,
    fontFamily: fontFamilyBold,
    color: colors.black,
  },
  focusStick: {
    backgroundColor: colors.primary,
    height: 5,
    width: 5,
    borderRadius: 50,
  },
  activePinCodeContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  bottomContainer: {
    marginTop: 10,
  },
  resendContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    paddingVertical: 10,
    // width: 150,
  },
  image: {
    height: 25,
    width: 25,
  },
});
