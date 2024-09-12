import React, {useEffect} from 'react';
import {
  AppSafeAreaView,
  AppText,
  BLUE,
  Button,
  FOURTEEN,
  KeyBoardAware,
  Loader,
  ORANGE,
  PRIMARY,
  SEMI_BOLD,
  SIXTEEN,
  TEN,
  TWENTY,
  TouchableOpacityView,
} from '../common';
import {
  PermissionsAndroid,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {
  dotIcon,
  profilePlaceholder,
  rightArrowIcon,
} from '../helper/ImageAssets';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import {
  borderWidth,
  universalPaddingHorizontal,
  universalPaddingVertical,
} from '../theme/dimens';
import NavigationService from '../navigation/NavigationService';
import {CALLING_SCREEN, PATIENT_SCREEN} from '../navigation/routes';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {IMAGE_BASE_URL} from '../helper/Constants';
import moment from 'moment';
import {getAge} from '../helper/utility';
import {
  getAgoraDetails,
  getHomeData,
  getPatientDetails,
  updateProfile,
} from '../actions/authActions';
import {ListEmptyComponent} from './Calendar';
import FastImage from 'react-native-fast-image';

const Home = () => {
  const dispatch = useAppDispatch();
  const {isLoading, homeData} = useAppSelector(state => state.auth);
  const {
    data: _data,
    result,
    todaysAppointment,
    ongoingAppointment,
  } = homeData ?? '';

  // console.log('++++++', JSON.stringify(homeData));

  const {name, avatar} = _data ?? '';

  const data = [
    {
      id: '1',
      title: 'Consultations',
      value: (result && result[0]?.count) ?? 0,
    },
    {
      id: '2',
      title: 'Earnings',
      value: (result && result[0]?.totalDoctorFees) ?? 0,
    },
  ];

  useEffect(() => {
    dispatch(updateProfile({}, false, false));
    getPermission();
  }, []);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);
    }
  };

  return (
    <AppSafeAreaView>
      <KeyBoardAware
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={colors.primary}
            onRefresh={() => {
              dispatch(updateProfile({}, false, false));
              dispatch(getHomeData());
            }}
          />
        }>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <View style={styles.header}>
              <AppText type={SIXTEEN} weight={SEMI_BOLD}>
                Hello!{'\n'}
                {name},
              </AppText>
              <FastImage
                source={
                  avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder
                }
                style={styles.profileIcon}
                resizeMode="cover"
              />
            </View>
            <View style={styles.headerSecond}>
              {data.map(e => {
                let space = e.id == '1' ? {marginRight: 10} : {marginLeft: 10};
                return (
                  <LinearGradient
                    key={e.id}
                    colors={[colors.gradient_one, colors.gradient_second]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={[styles.gradientBox, space]}>
                    <AppText type={SIXTEEN} weight={SEMI_BOLD}>
                      {e.title}
                    </AppText>
                    <AppText
                      style={styles.linearValue}
                      type={TWENTY}
                      color={PRIMARY}
                      weight={SEMI_BOLD}>
                      {e.value}
                    </AppText>
                  </LinearGradient>
                );
              })}
            </View>

            {todaysAppointment?.length !== 0 && (
              <>
                <AppText
                  style={styles.headerTitle}
                  type={SIXTEEN}
                  weight={SEMI_BOLD}>
                  Today’s Schedule
                </AppText>
                {todaysAppointment?.map(e => {
                  return (
                    <View key={e._id} style={[styles.scheduleContainer]}>
                      <AppText
                        style={styles.time}
                        weight={SEMI_BOLD}
                        numberOfLines={1}
                        color={BLUE}>
                        {moment.utc(e?.dateTime).format('hh:mm A')}
                      </AppText>
                      <TouchableOpacityView
                        onPress={() => {
                          dispatch(getPatientDetails(e?._id));
                          NavigationService.navigate(PATIENT_SCREEN);
                        }}
                        style={styles.scheduleContainerSecond}>
                        <View style={styles.scheduleContainer}>
                          <FastImage
                            source={
                              e?.user?.avatar
                                ? {uri: IMAGE_BASE_URL + e?.user?.avatar}
                                : profilePlaceholder
                            }
                            resizeMode="cover"
                            style={styles.scheduleIcon}
                          />
                          <View style={styles.scheduleContainerThird}>
                            <AppText
                              weight={SEMI_BOLD}
                              numberOfLines={1}
                              type={FOURTEEN}>
                              {e?.user?.name}
                            </AppText>
                            <View style={styles.scheduleContainer}>
                              <AppText type={TEN}>
                                {getAge(e?.user?.dob)} years
                              </AppText>
                              <FastImage
                                source={dotIcon}
                                resizeMode="contain"
                                style={styles.dotIcon}
                              />
                              <AppText type={TEN}>{e?.user?.gender}</AppText>
                            </View>
                          </View>
                        </View>
                        <View>
                          <FastImage
                            source={rightArrowIcon}
                            resizeMode="contain"
                            style={styles.rightArrowIcon}
                          />
                        </View>
                      </TouchableOpacityView>
                    </View>
                  );
                })}
              </>
            )}

            {ongoingAppointment?.length !== 0 && (
              <>
                <AppText
                  style={styles.headerTitle}
                  color={ORANGE}
                  type={SIXTEEN}
                  weight={SEMI_BOLD}>
                  Ongoing
                </AppText>
                <AppText>
                  Your appointment slot has started. Please initiate the call
                  with your patient.
                </AppText>
                <View style={styles.ongoingMain}>
                  {ongoingAppointment?.map((e, index) => {
                    return (
                      <View key={index} style={styles.ongoingContainer}>
                        <TouchableOpacityView
                          onPress={() => {
                            dispatch(getPatientDetails(e?._id));
                            NavigationService.navigate(PATIENT_SCREEN);
                          }}
                          style={styles.scheduleContainer}>
                          <FastImage
                            source={
                              e?.user?.avatar
                                ? {uri: IMAGE_BASE_URL + e?.user?.avatar}
                                : profilePlaceholder
                            }
                            resizeMode="cover"
                            style={styles.scheduleIcon}
                          />
                          <View style={styles.scheduleContainerThird}>
                            <AppText
                              weight={SEMI_BOLD}
                              numberOfLines={1}
                              type={FOURTEEN}>
                              {e?.user?.name}
                            </AppText>
                            <View style={styles.scheduleContainer}>
                              <AppText type={TEN}>
                                {getAge(e?.user?.dob)} years
                              </AppText>
                            </View>
                          </View>
                        </TouchableOpacityView>
                        <View style={styles.border} />
                        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
                          {e?.subscription?.careHealthPlanName}
                        </AppText>
                        <Button
                          onPress={() => {
                            dispatch(getAgoraDetails(e?.user?._id, e?._id));
                            dispatch(getPatientDetails(e?._id));
                            NavigationService.navigate(CALLING_SCREEN);
                          }}
                          children="Start Call"
                        />
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {todaysAppointment?.length === 0 &&
              ongoingAppointment?.length === 0 && (
                <ListEmptyComponent title="No Upcoming Appointments" />
              )}

            <View style={{height: 50}} />
          </>
        )}
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  headerSecond: {
    flexDirection: 'row',
    marginTop: 20,
  },
  gradientBox: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  linearValue: {
    marginTop: 10,
  },
  headerTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  scheduleContainerSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light_brown,
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
    marginStart: universalPaddingHorizontal,
    padding: universalPaddingVertical,
  },
  scheduleIcon: {
    height: 45,
    width: 45,
    borderRadius: 30,
    marginRight: 10,
  },
  dotIcon: {
    height: 3,
    width: 3,
    marginHorizontal: 10,
  },
  rightArrowIcon: {
    height: 22,
    width: 22,
    // flex: 0.2,
  },
  remindersContainer: {
    marginTop: 10,
    borderWidth: borderWidth,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: universalPaddingVertical,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  dotIcon2: {
    height: 3,
    width: 3,
    marginTop: 7,
    marginRight: 10,
    // marginHorizontal: 10,
  },
  time: {
    flex: 0.3,
  },
  ongoingMain: {
    marginTop: 20,
  },
  ongoingContainer: {
    backgroundColor: colors.white,
    elevation: 1,
    marginVertical: 10,
    borderRadius: 10,
    padding: universalPaddingVertical,
    borderWidth: 1,
    borderColor: colors.light_gray,
    shadowOpacity: 0.1,
  },
  scheduleContainerThird: {
    width: '55%',
  },
  border: {
    height: 0.5,
    backgroundColor: colors.gray,
    marginVertical: 5,
  },
});
