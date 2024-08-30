import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform, StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {AppText, SEMI_BOLD, THIRTEEN, WHITE} from './common';
import {useAppDispatch} from './store/hooks';
import FcmService from './FcmService';

const NoInternetModal = ({visible}) => {
  return visible ? (
    <View style={styles.noInternet}>
      <AppText type={THIRTEEN} color={WHITE} weight={SEMI_BOLD}>
        No Internet Connection
      </AppText>
    </View>
  ) : (
    <></>
  );
};

const RootComponent = ({children}) => {
  const dispatch = useAppDispatch();
  const [netConnected, setNetConnected] = useState(true);
  const [visible, setVisible] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!netConnected) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [netConnected]);

  useEffect(() => {
    let fcmService = new FcmService();
    fcmService.register(onNotification, onOpenNotification);
  }, []);
  const onNotification = message => {};
  const onOpenNotification = message => {};

  return (
    <View style={{flex: 1}}>
      <NoInternetModal visible={visible} />
      {children}
    </View>
  );
};

export default RootComponent;
const styles = StyleSheet.create({
  noInternet: {
    height: 30,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : 30,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  updateBg: {
    height: '100%',
    width: '100%',
  },
});
