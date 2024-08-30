import React, {useEffect} from 'react';
import {
  AppSafeAreaView,
  AppText,
  Button,
  EIGHTEEN,
  KeyBoardAware,
  Loader,
  SEMI_BOLD,
} from '../common';
import {Image, StyleSheet} from 'react-native';
import {introImg} from '../helper/ImageAssets';
import {commonStyles} from '../theme/commonStyles';
import NavigationService from '../navigation/NavigationService';
import {LOGIN_SCREEN, NAVIGATION_AUTH_STACK} from '../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_TOKEN_KEY} from '../helper/Constants';
import {useAppDispatch} from '../store/hooks';
import {getUserProfile} from '../actions/authActions';
import FastImage from 'react-native-fast-image';

const WelcomeScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <AppSafeAreaView>
      <KeyBoardAware>
        <>
          <FastImage
            source={introImg}
            resizeMode="contain"
            style={styles.image}
          />
          <AppText
            style={commonStyles.textAlign}
            type={EIGHTEEN}
            weight={SEMI_BOLD}>
            Empower Your Practice,{'\n'}Expand Your Reach:{'\n'}Join Our
            Platform for{'\n'}Seamless Healthcare{'\n'}Solutions.
          </AppText>
          <Button
            children="Get Started"
            onPress={() => NavigationService.navigate(LOGIN_SCREEN)}
          />
        </>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  image: {
    height: 400,
    width: 400,
    alignSelf: 'center',
    marginTop: '15%',
  },
});
