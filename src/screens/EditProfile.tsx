import React, {useEffect, useRef, useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  Button,
  Input,
  KeyBoardAware,
  SEMI_BOLD,
  SIXTEEN,
  TouchableOpacityView,
} from '../common';
import Toolbar from '../common/Toolbar';
import {Image, StyleSheet, View} from 'react-native';
import {editIcon, profilePlaceholder} from '../helper/ImageAssets';
import {MediaUploadModal} from '../common/MediaUploadModal';
import {smallInputHeight} from '../theme/dimens';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {updateProfile, uploadImage} from '../actions/authActions';
import {IMAGE_BASE_URL} from '../helper/Constants';
import {colors} from '../theme/colors';
import FastImage from 'react-native-fast-image';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const {userData, homeData, isLoading} = useAppSelector(state => state.auth);
  const {
    name: _name,
    email: _email,
    phone: _phone,
    specializations,
    yearsOfExperience,
    certification,
    briefBio,
    educationQualification,
    _id,
  } = userData ?? '';
  const {data: _data} = homeData ?? '';
  const {avatar} = _data ?? '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [certificates, setCertificates] = useState();
  const [isMediaVisible, setIsMediaVisible] = useState(false);
  const [isCertificate, setIsCertificate] = useState(false);
  const [image, setImage] = useState(undefined);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const specializationRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const bioRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setName(_name);
      setEmail(_email);
      setPhone(_phone);
      setSpecialization(specializations);
      setExperience(yearsOfExperience?.toString());
      setEducation(educationQualification);
      setBio(briefBio);
    }
  }, []);

  useEffect(() => {
    if (image) {
      let data = new FormData();
      data.append('image', {
        uri: image?.path,
        type: image?.mime,
        name: image?.modificationDate + '.' + image?.mime?.split('/')[1],
      });
      dispatch(uploadImage(data, _id, null));
    }
  }, [image]);

  const onSave = () => {
    let data = {
      name: name,
      email: email,
      specializations: specialization,
      yearsOfExperience: experience,
      briefBio: bio,
      educationQualification: education,
      certification: certificates,
    };

    if (certificates) {
      let _data = new FormData();
      _data.append('image', {
        uri: certificates?.path,
        type: certificates?.mime,
        name:
          certificates?.modificationDate +
          '.' +
          certificates?.mime?.split('/')[1],
      });
      dispatch(uploadImage(_data, null, data));
    } else {
      dispatch(updateProfile(data, true));
    }
  };

  return (
    <AppSafeAreaView>
      <Toolbar />
      <KeyBoardAware>
        <>
          <View style={styles.header}>
            <AppText weight={SEMI_BOLD} type={SIXTEEN}>
              Personal Information
            </AppText>
            <TouchableOpacityView
              onPress={() => {
                setIsCertificate(false);
                setIsMediaVisible(true);
              }}
              style={styles.profileContainer}>
              <FastImage
                source={
                  image
                    ? {uri: image?.path}
                    : avatar
                    ? {uri: IMAGE_BASE_URL + avatar}
                    : profilePlaceholder
                }
                resizeMode="cover"
                style={styles.profile}
              />
              <FastImage
                source={editIcon}
                resizeMode="contain"
                style={styles.editIcon}
              />
            </TouchableOpacityView>
          </View>
          <Input
            isSecond
            title="Full Name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => {
              emailRef?.current?.focus();
            }}
            returnKeyType="next"
            inputStyle={styles.inputStyle}
          />
          <Input
            isSecond
            title="Email"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => {
              phoneRef?.current?.focus();
            }}
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            assignRef={(input: InputRef | null) => {
              emailRef.current = input;
            }}
            inputStyle={styles.inputStyle}
          />
          <Input
            isSecond
            title="Contact"
            value={phone}
            onChangeText={setPhone}
            onSubmitEditing={() => {
              specializationRef?.current?.focus();
            }}
            keyboardType="number-pad"
            returnKeyType="next"
            assignRef={(input: InputRef | null) => {
              phoneRef.current = input;
            }}
            editable={false}
            inputStyle={styles.inputStyle}
          />
          <AppText style={styles.heading} weight={SEMI_BOLD} type={SIXTEEN}>
            Professional Information
          </AppText>
          <Input
            isSecond
            title="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
            onSubmitEditing={() => {
              experienceRef?.current?.focus();
            }}
            returnKeyType="next"
            assignRef={(input: InputRef | null) => {
              specializationRef.current = input;
            }}
            inputStyle={styles.inputStyle}
          />
          <Input
            isSecond
            title="Years of Experience"
            value={experience}
            onChangeText={setExperience}
            onSubmitEditing={() => {
              specialization?.current?.focus();
            }}
            returnKeyType="next"
            keyboardType="numeric"
            assignRef={(input: InputRef | null) => {
              experienceRef.current = input;
            }}
            inputStyle={styles.inputStyle}
          />
          <Input
            isSecond
            title="Educational qualifications"
            titleSecond="for e.g. Ace certified, slcl01, etc."
            value={education}
            onChangeText={setEducation}
            returnKeyType="next"
            assignRef={(input: InputRef | null) => {
              educationRef.current = input;
            }}
            onSubmitEditing={() => {
              bioRef?.current?.focus();
            }}
            inputStyle={styles.inputStyle}
          />
          <Input
            isSecond
            title="Write a brief bio"
            value={bio}
            onChangeText={setBio}
            returnKeyType="done"
            assignRef={(input: InputRef | null) => {
              bioRef.current = input;
            }}
            inputStyle={styles.inputStyle}
          />
          {certificates && (
            <View style={styles.certificateContainer}>
              <FastImage
                source={{uri: certificates?.path}}
                resizeMode="cover"
                style={styles.certificateImage}
              />
            </View>
          )}
          <View style={[styles.header, {marginTop: 20}]}>
            <AppText type={SIXTEEN} weight={SEMI_BOLD}>
              Certificates
            </AppText>
            <Button
              children="Upload"
              onPress={() => {
                setIsCertificate(true);
                setIsMediaVisible(true);
              }}
              containerStyle={styles.uploadButtonContainer}
              titleStyle={styles.uploadButtonTitle}
            />
          </View>

          <Button
            children="Save details"
            onPress={() => onSave()}
            containerStyle={styles.saveButtonContainer}
            loading={isLoading}
          />
        </>
      </KeyBoardAware>
      <MediaUploadModal
        isVisible={isMediaVisible}
        setIsVisible={setIsMediaVisible}
        setImage={isCertificate ? setCertificates : setImage}
      />
    </AppSafeAreaView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    height: 55,
    width: 55,
    borderRadius: 30,
  },
  editIcon: {
    height: 20,
    width: 20,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
  },
  profileContainer: {
    height: 65,
  },
  heading: {
    marginTop: 20,
  },
  uploadButtonTitle: {
    fontSize: 12,
  },
  uploadButtonContainer: {
    marginTop: 0,
    height: smallInputHeight,
    paddingHorizontal: 20,
  },
  saveButtonContainer: {
    marginVertical: 20,
    marginBottom: 50,
  },
  inputStyle: {
    fontSize: 14,
  },
  certificateContainer: {
    height: 200,
    width: '100%',
    marginTop: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: colors.gray,
  },
  certificateImage: {
    height: '100%',
    width: '100%',
  },
});
