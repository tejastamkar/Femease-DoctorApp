import React from 'react';
import {
  AppSafeAreaView,
  AppText,
  BORDER,
  Button,
  FOURTEEN,
  KeyBoardAware,
  Loader,
  MEDIUM,
  NORMAL,
  SEMI_BOLD,
  SIXTEEN,
} from '../common';
import Toolbar from '../common/Toolbar';
import {StyleSheet, View} from 'react-native';
import {borderWidth} from '../theme/dimens';
import {colors} from '../theme/colors';
import {commonStyles} from '../theme/commonStyles';
import NavigationService from '../navigation/NavigationService';
import {CALLING_SCREEN} from '../navigation/routes';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {IMAGE_BASE_URL} from '../helper/Constants';
import moment from 'moment';
import {getAgoraDetails} from '../actions/authActions';
import {profilePlaceholder} from '../helper/ImageAssets';
import FastImage from 'react-native-fast-image';

export const PatientHistoryContainer = () => {
  const {patientDetails} = useAppSelector(state => state.auth);

  const {patientHistory} = patientDetails ?? '';

  return (
    <View style={[styles.historyContainer, {borderBottomWidth: 0}]}>
      <AppText weight={SEMI_BOLD} type={SIXTEEN}>
        Patient History
      </AppText>
      {patientHistory?.map((e, index) => {
        return (
          <View style={styles.detailSingle} key={e.id}>
            <View style={styles.detailSingleSecond}>
              <AppText style={commonStyles.flex} color={BORDER} weight={MEDIUM}>
                {index === 0
                  ? 'Last visited'
                  : moment.utc(e?.date).format('ll')}
              </AppText>
              {index === 0 && (
                <AppText weight={MEDIUM}>
                  {moment.utc(e?.date).format('lll')}
                </AppText>
              )}
            </View>

            {index === 0 && <View style={styles.border} />}
            {e?.prescription && (
              <AppText
                style={styles.prescription}
                weight={index === 0 ? MEDIUM : NORMAL}>
                {e?.prescription}
              </AppText>
            )}
          </View>
        );
      })}
    </View>
  );
};

export const JoiningLinkContainer = ({userId, appointmentId}) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      onPress={() => {
        dispatch(getAgoraDetails(userId, appointmentId));
        NavigationService.navigate(CALLING_SCREEN);
      }}
      children="Start Call"
    />
  );
};

export const AppointmentContainer = () => {
  const {patientDetails} = useAppSelector(state => state.auth);

  const {consultingFor, dateTime, endDateTime} = patientDetails ?? '';

  // console.log('++++++++++', JSON.stringify(patientDetails));

  var a = moment(dateTime); //now
  var b = moment(endDateTime);
  let hours = b.diff(a, 'hours');

  let time = `${moment.utc(dateTime).format('hh:mma')} - ${moment
    .utc(endDateTime)
    .format('hh:mma')}(${hours} hour)`;

  const data = [
    {
      id: '1',
      title: 'Date',
      value: moment.utc(dateTime).format('ll'),
    },
    {
      id: '2',
      title: 'Time',
      value: time,
    },
    {
      id: '3',
      title: 'Consulting for',
      value: consultingFor,
    },
  ];
  return (
    <View style={styles.detailSecond}>
      {data?.map(e => {
        return (
          <View style={styles.detailSingleThird} key={e.id}>
            <AppText
              style={commonStyles.flex}
              color={BORDER}
              type={FOURTEEN}
              weight={MEDIUM}>
              {e.title}
            </AppText>
            <AppText
              style={[commonStyles.flex, styles.valueText]}
              weight={e.id === '3' ? MEDIUM : NORMAL}>
              {e.value}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const PatientDetails = () => {
  const {isLoading, patientDetails} = useAppSelector(state => state.auth);

  const {name, avatar, userId, _id} = patientDetails ?? '';

  return (
    <AppSafeAreaView>
      <Toolbar />
      <KeyBoardAware>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <View style={styles.header}>
              <AppText weight={SEMI_BOLD} type={SIXTEEN}>
                Patient Details
              </AppText>
              <View style={styles.center}>
                <FastImage
                  source={
                    avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder
                  }
                  resizeMode="cover"
                  style={styles.profile}
                />
                <AppText weight={SEMI_BOLD}>{name}</AppText>
              </View>
            </View>
            <AppointmentContainer />
            <PatientHistoryContainer />
            <JoiningLinkContainer userId={userId} appointmentId={_id} />
            <View style={{height: 50}} />
          </>
        )}
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default PatientDetails;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    height: 55,
    width: 55,
    borderRadius: 40,
  },
  detailSecond: {
    marginTop: 20,
  },
  detailSingle: {
    justifyContent: 'space-between',
    marginVertical: 10,
    borderColor: colors.gray,
    borderBottomWidth: borderWidth,
  },
  historyContainer: {
    marginTop: 20,
    borderTopWidth: borderWidth,
    borderColor: colors.gray,
    borderBottomWidth: borderWidth,
    paddingVertical: 20,
  },
  link: {
    marginVertical: 15,
  },
  right: {
    height: 25,
    width: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.light_brown,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  border: {
    height: borderWidth,
    backgroundColor: colors.gray,
    marginTop: 5,
  },
  prescription: {
    marginVertical: 10,
  },
  detailSingleSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailSingleThird: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
