import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {AppText, MEDIUM} from './AppText';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Image} from 'react-native';
import {colors} from '../theme/colors';
import {cameraIcon, docIcon, galleryIcon} from '../helper/ImageAssets';
import DocumentPicker from 'react-native-document-picker';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';

interface MediaUploadModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: any;
  isPdf?: boolean;
}

export const getCameraPermissions = async () => {
  const granted = await request(
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA,
  );

  return granted === RESULTS.GRANTED;
};

export const getGalleryPermissions = async () => {
  let systemVersion = DeviceInfo.getSystemVersion();

  const granted = await request(
    Platform.OS === 'android'
      ? systemVersion < '12'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.IOS.PHOTO_LIBRARY,
  );
  return granted === RESULTS.GRANTED || granted === RESULTS.LIMITED;
};

export const createAlert = () =>
  Alert.alert(
    'We required Library permission in order to use access media library.. Please grant us.',
    '',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => Linking.openSettings()},
    ],
  );

const MediaUploadModal = ({
  isVisible,
  setIsVisible,
  setImage,
  isPdf,
}: MediaUploadModalProps) => {
  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        image['mediaType'] = 'image';
        setImage(image);
      })
      .catch(err => {
        console.log('err:::', err);
      });
  };

  const checkGallery = () => {
    getGalleryPermissions().then(res => {
      if (res) {
        openGallery();
      } else {
        createAlert();
      }
    });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        image['mediaType'] = 'image';
        setImage(image);
      })
      .catch(e => {
        console.log('e::::', e);
      });
  };

  const checkCamera = () => {
    getCameraPermissions().then(res => {
      if (res) {
        openCamera();
      } else {
        createAlert();
      }
    });
  };

  const onUpload = async () => {
    try {
      let res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      res['mediaType'] = 'pdf';
      setImage(res);
    } catch (err) {
      console.log('error at pdf', err);
    }
  };
  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}
      animationOut={'slideOutDown'}
      animationIn="slideInUp">
      <View style={styles.modalContainer}>
        {isPdf && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              setIsVisible(false);
              setTimeout(() => {
                onUpload();
              }, 800);
            }}>
            <FastImage
              resizeMode="contain"
              style={styles.icon}
              source={docIcon}
              tintColor={colors.primary}
            />
            <AppText weight={MEDIUM}>Pdf</AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setIsVisible(false);
            setTimeout(() => {
              checkGallery();
            }, 800);
          }}>
          <FastImage
            resizeMode="contain"
            style={styles.icon}
            source={galleryIcon}
            tintColor={colors.primary}
          />
          <AppText weight={MEDIUM}>Gallery</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setIsVisible(false);
            setTimeout(() => {
              checkCamera();
            }, 800);
          }}>
          <FastImage
            resizeMode="contain"
            style={{height: 40, width: 40}}
            source={cameraIcon}
            tintColor={colors.primary}
          />
          <AppText weight={MEDIUM}>Camera</AppText>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
};

export {MediaUploadModal};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    marginTop: 'auto',
    height: 120,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    height: 40,
    width: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
