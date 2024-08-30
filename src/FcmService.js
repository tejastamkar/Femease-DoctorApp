/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {FCM_TOKEN_KEY} from './helper/Constants';
import NotifService from './NotifService';
import {EventRegister} from 'react-native-event-listeners';
import NavigationService from './navigation/NavigationService';

export default class FcmService {
  constructor() {
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }
  onRegister(token) {
    // this.setState({ registerToken: token.token, fcmRegistered: true });
  }

  onNotif(notif) {
    // Alert.alert(notif.title, notif.message);
  }

  register = (onNotification, onOpenNotification) => {
    this.checkPermission(onNotification, onOpenNotification);
  };

  registerAppWithFCM = (onNotification, onOpenNotification) => {
    if (Platform.OS === 'ios') {
      messaging()
        .registerDeviceForRemoteMessages()
        .then(register => {
          // console.log("register", register);
          this.getToken(onNotification, onOpenNotification);
        });
    } else {
      this.getToken(onNotification, onOpenNotification);
    }
  };

  checkPermission = (onNotification, onOpenNotification) => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled == messaging.AuthorizationStatus.AUTHORIZED) {
          this.registerAppWithFCM(onNotification, onOpenNotification);
          //user has permission
        } else {
          //user don't have permission
          this.requestPermission(onNotification, onOpenNotification);
        }
      })
      .catch(error => {
        this.requestPermission(onNotification, onOpenNotification);
        let err = `check permission error${error}`;
        // Alert.alert(err)
        console.log('[FCMService] Permission rejected', error);
      });
  };

  getToken = async (onNotification, onOpenNotification) => {
    let fcmToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    const customerToken = await AsyncStorage.getItem('authToken');
    // console.log('fcm service:::::::::::::::::::::', fcmToken);
    // console.log('fcm service::::::::::::::customerToken:::::::', customerToken);

    messaging()
      .getToken()
      .then(fcmToken => {
        // Alert.alert(fcmToken)
        if (fcmToken) {
          this.setToken(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected ', error);
      });

    this.createNoitificationListeners(
      onNotification,
      onOpenNotification,
      customerToken,
    );
  };

  async setToken(token) {
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
  }

  requestPermission = (onNotification, onOpenNotification) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.registerAppWithFCM(onNotification, onOpenNotification);
      })
      .catch(error => {
        console.log('[FCMService] Requested persmission rejected ', error);
      });
  };

  deletedToken = async () => {
    await messaging()
      .deleteToken()
      .catch(error => {
        console.log('Delected token error ', error);
      });
  };

  createNoitificationListeners = (
    onNotification,
    onOpenNotification,
    customerToken,
  ) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // Alert.alert(remoteMessage)
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
        EventRegister.emit('myCustomEvent', 'it works!!!');
        customerToken && NavigationService.navigate('NotificationList');
      }
    });

    // when the application is opened form a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        // Alert.alert(remoteMessage)
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage) {
          onOpenNotification(remoteMessage);
          EventRegister.emit('myCustomEvent', 'it works!!!');
          customerToken && NavigationService.navigate('NotificationList');
        }
        //
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      // Alert.alert(remoteMessage)
      console.log('[FCMService] A new FCM message arrived', remoteMessage);
      if (remoteMessage) {
        this.notif.localNotif(remoteMessage);
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage;
        } else {
          notification = remoteMessage;
        }

        // onNotification(notification);
      }
      EventRegister.emit('myCustomEvent', 'it works!!!');
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      // console.log("New token refresh: ", fcmToken)
      this.setToken(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}
