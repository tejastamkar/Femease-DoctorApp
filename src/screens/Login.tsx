import React, {useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  Button,
  Input,
  KeyBoardAware,
  SEMI_BOLD,
  TWENTY,
} from '../common';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {sendOtp} from '../actions/authActions';

const Login = () => {
  const dispatch = useAppDispatch();
  const {isLoading} = useAppSelector(state => state.auth);
  const [phoneNumber, setPhoneNumber] = useState('');
  const onSubmit = () => {
    let data = {
      phone: phoneNumber,
      countryCode: '91',
    };
    dispatch(sendOtp(data));
  };
  return (
    <AppSafeAreaView>
      <KeyBoardAware>
        <>
          <AppText type={TWENTY} weight={SEMI_BOLD}>
            Enter your mobile number to get OTP
          </AppText>
          <Input
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onSubmitEditing={() => {
              onSubmit();
            }}
          />
          <Button
            children="Get OTP"
            onPress={() => onSubmit()}
            loading={isLoading}
            disabled={phoneNumber.length !== 10}
          />
        </>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default Login;
