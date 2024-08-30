import React, {useRef, useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  IRtcEngineEx,
} from 'react-native-agora';
import {AppSafeAreaView, Loader} from '../common';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import NavigationService from '../navigation/NavigationService';
import {SUBMIT_REPORT_SCREEN} from '../navigation/routes';
import {
  callEndIcon,
  muteIcon,
  switchCameraIcon,
  unmuteIcon,
} from '../helper/ImageAssets';
import {colors} from '../theme/colors';
import {timeDifference} from '../helper/utility';
import {showError} from '../helper/logger';
import {updateCallStatus} from '../actions/authActions';
import FastImage from 'react-native-fast-image';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const CallingScreen = ({route}) => {
  const dispatch = useAppDispatch();
  const {agoraDetails, patientDetails} = useAppSelector(state => {
    return state.auth;
  });

  // var isMuted = false;
  const appId = '963bbc15825c4ecf8d1a5d80a469b3b0';
  const channelName = agoraDetails?.channelName;
  const token = agoraDetails?.token;
  const uid = 0;
  const agoraEngineRef = useRef<IRtcEngineEx>(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [isMute, setIsMute] = useState(true); // Indicates if current user is mute or note
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  const [startTime, setStartTime] = useState();

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVideoSDKEngine();
  }, [agoraDetails]);

  // useEffect(() => {
  //   if (remoteUid) {
  //     return;
  //   }
  //   setTimeout(() => {
  //     leave(false);
  //   }, 60000);
  // }, [remoteUid]);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }

      agoraEngineRef.current = createAgoraRtcEngine() as IRtcEngineEx;
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
          setStartTime(new Date());
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);

          leave();
          setIsJoined(false);
        },
      });
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
      agoraEngine.enableVideo();
      if (!isJoined) {
        join();
      }
    } catch (e) {
      console.log(e);
    }
  };
  function showMessage(msg: string) {
    setMessage(msg);
    console.log('++++++', msg);
  }
  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const leave = (userRespond = true) => {
    try {
      setRemoteUid(0);
      setIsJoined(false);
      agoraEngineRef.current?.stopPreview();

      agoraEngineRef.current?.leaveChannel({
        stopAudioMixing: true,
        stopAllEffect: true,
        stopMicrophoneRecording: true,
      });

      showMessage('You left the channel');
      if (userRespond) {
        let data = {
          id: patientDetails?._id,
          status: 'Completed',
        };
        dispatch(updateCallStatus(data));
        NavigationService.replace(SUBMIT_REPORT_SCREEN, {
          duration: timeDifference(startTime, new Date()),
        });
      } else {
        NavigationService.goBack();
        showError('No response from other side');
      }
    } catch (e) {
      console.log(e);
    }
  };
  const switchCam = () => {
    agoraEngineRef.current?.switchCamera();
  };
  const mute = () => {
    agoraEngineRef.current?.muteLocalAudioStream(isMute);
    setIsMute(!isMute);
  };
  return (
    <AppSafeAreaView>
      <React.Fragment key={0}>
        {isJoined ? (
          <RtcSurfaceView
            canvas={{uid: 0}}
            style={remoteUid == 0 ? styles.videoView1 : styles.videoView}
          />
        ) : (
          <View
            style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Loader />
          </View>
        )}
      </React.Fragment>

      {isJoined && remoteUid !== 0 ? (
        <React.Fragment key={remoteUid}>
          <RtcSurfaceView canvas={{uid: remoteUid}} style={styles.videoView} />
        </React.Fragment>
      ) : (
        <></>
      )}
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={switchCam} style={styles.button}>
          <FastImage
            source={switchCameraIcon}
            resizeMode="contain"
            style={styles.camera}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={leave} style={styles.button}>
          <FastImage
            source={callEndIcon}
            resizeMode="contain"
            style={styles.camera}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={mute} style={styles.button}>
          <FastImage
            source={!isMute ? unmuteIcon : muteIcon}
            resizeMode="contain"
            style={styles.camera}
          />
        </TouchableOpacity>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center', paddingTop: 40},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  videoView: {
    width: '100%',
    height:
      Platform.OS === 'ios'
        ? dimensions.height / 2 - 60
        : dimensions.height / 2 - 20,
  },
  videoView1: {
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
    height: dimensions.height,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'android' ? 0 : 20,
  },
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', color: '#0000ff'},
  camera: {
    height: 30,
    width: 30,
    tintColor: colors.primary,
  },
});
export default CallingScreen;
