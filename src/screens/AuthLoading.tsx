import React, {useEffect} from 'react';
import {AppSafeAreaView} from '../common';
import {StyleSheet, View} from 'react-native';
import {splash} from '../helper/ImageAssets';
import {commonStyles} from '../theme/commonStyles';
import NavigationService from '../navigation/NavigationService';
import {NAVIGATION_AUTH_STACK} from '../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_TOKEN_KEY} from '../helper/Constants';
import {useAppDispatch} from '../store/hooks';
import {getUserProfile} from '../actions/authActions';
import AnimatedLottieView from 'lottie-react-native';
import {colors} from '../theme/colors';

const AuthLoading = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      bootstrapAsync();
    }, 3000);
  }, []);

  const bootstrapAsync = async () => {
    try {
      const customerToken = await AsyncStorage.getItem(USER_TOKEN_KEY);

      customerToken
        ? dispatch(getUserProfile())
        : NavigationService.reset(NAVIGATION_AUTH_STACK);
    } catch (e) {
      console.log(e);
      NavigationService.reset(NAVIGATION_AUTH_STACK);
    }
  };

  return (
    <AppSafeAreaView statusColor={colors.splash}>
      <View
        style={[
          commonStyles.whiteBackgroundWithOutPadding,
          {backgroundColor: colors.splash},
        ]}>
        <AnimatedLottieView
          style={{height: '100%', width: '100%'}}
          source={splash}
          autoPlay
          speed={1}
          loop={false}
        />
      </View>
    </AppSafeAreaView>
  );
};

export default AuthLoading;
const styles = StyleSheet.create({
  image: {
    height: 400,
    width: 400,
    alignSelf: 'center',
    marginTop: '15%',
  },
});
