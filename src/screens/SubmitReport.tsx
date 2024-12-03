import React, {useEffect, useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  BLACK,
  Button,
  FOURTEEN,
  Input,
  KeyBoardAware,
  LIGHT,
  MEDIUM,
  RED,
  SEMI_BOLD,
  TEN,
  TouchableOpacityView,
  TWENTY,
} from '../common';
import {BackHandler, Image, StyleSheet, View} from 'react-native';
import NavigationService from '../navigation/NavigationService';
import {profilePlaceholder, uploadIcon} from '../helper/ImageAssets';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {colors} from '../theme/colors';
import {MediaUploadModal} from '../common/MediaUploadModal';
import {submitReport, updateReportAction, uploadImage, uploadPdf} from '../actions/authActions';
import {IMAGE_BASE_URL} from '../helper/Constants';
import {getAge} from '../helper/utility';
import {useRoute} from '@react-navigation/native';
import Toolbar from '../common/Toolbar';
import FastImage from 'react-native-fast-image';

const SubmitReport = ({navigation}) => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const isComplete = route?.params?.isComplete ?? '';
  const updateReport = route?.params?.updateReport ?? '';
  const duration = route?.params?.duration ?? '';
  const {patientDetails, isLoading} = useAppSelector(state => state.auth);
  const {name, avatar, _id, dob} = patientDetails ?? '';
  const [remark, setRemark] = useState('');
  const [image, setImage] = useState(undefined);
  const [isMediaVisible, setIsMediaVisible] = useState(false);
  const [pdf, setPdf] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        (isComplete || updateReport)
          ? NavigationService.goBack()
          : NavigationService.navigate('Home');
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (image?.mediaType === 'pdf') {
      let data = new FormData();
      data.append('file', {
        uri: image?.uri,
        name: image?.name,
        type: image?.type,
      });
      dispatch(uploadPdf(data, setPdf));
    } else if (image?.mediaType === 'image') {
      let _data = new FormData();
      _data.append('image', {
        uri: image?.path,
        type: image?.mime,
        name: image?.modificationDate + '.' + image?.mime?.split('/')[1],
      });
      dispatch(uploadImage(_data, null, null, setPdf));
    }
  }, [image]);

  const onSubmit = () => {
    let data = {
      id: _id,
      prescription: remark,
      meetingReport: pdf,
    };

    updateReport ? dispatch(updateReportAction(data)) : dispatch(submitReport(data));
  };

  return (
    <AppSafeAreaView>
      {isComplete && <Toolbar />}
      <KeyBoardAware>
        <>
          <View style={styles.container}>
            {!isComplete && (
              <>
                <AppText type={TWENTY} weight={SEMI_BOLD} color={RED}>
                  Call ended
                </AppText>
                {duration ? (
                  <AppText weight={MEDIUM}>{duration} mins</AppText>
                ) : (
                  <></>
                )}
              </>
            )}

            <FastImage
              source={
                avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder
              }
              resizeMode="cover"
              style={styles.profile}
            />
            <AppText type={FOURTEEN} weight={SEMI_BOLD}>
              {name}
            </AppText>
            <AppText weight={LIGHT} type={TEN}>
              {getAge(dob)} years
            </AppText>
            <TouchableOpacityView
              onPress={() => setIsMediaVisible(true)}
              style={styles.uploadContainer}>
              <FastImage
                source={uploadIcon}
                resizeMode="contain"
                style={styles.uploadIcon}
              />
              <AppText color={BLACK} weight={MEDIUM}>
                {image?.name ? image?.name : pdf ? 'Image Uploaded' : 'Upload'}
              </AppText>
            </TouchableOpacityView>
          </View>
          <Input
            isSecond
            title="Add Remarks"
            value={remark}
            onChangeText={setRemark}
            onSubmitEditing={() => {}}
            returnKeyType="done"
            inputStyle={styles.inputStyle}
            secondContainer={styles.secondContainer}
            multiline
          />
        </>
        <Button
          onPress={() => {
            onSubmit();
          }}
          loading={isLoading}
          children={updateReport?'Update Report':"Submit Report"}
        />
      </KeyBoardAware>
      <MediaUploadModal
        isVisible={isMediaVisible}
        setIsVisible={setIsMediaVisible}
        setImage={setImage}
        isPdf
      />
    </AppSafeAreaView>
  );
};

export default SubmitReport;
const styles = StyleSheet.create({
  container: {
    marginTop: '30%',
    alignItems: 'center',
  },
  profile: {
    height: 75,
    width: 75,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  uploadContainer: {
    height: 150,
    backgroundColor: colors.light_brown,
    borderRadius: 15,
    width: '85%',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    height: 45,
    width: 45,
  },
  inputStyle: {
    height: 100,
  },
  secondContainer: {
    height: 100,
    borderRadius: 10,
  },
  report: {
    height: 150,
    width: '100%',
  },
});
