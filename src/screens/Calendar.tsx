import React, {useEffect, useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  BLACK,
  Button,
  FOURTEEN,
  KeyBoardAware,
  LIGHT,
  Loader,
  MEDIUM,
  ORANGE,
  PRIMARY,
  SEMI_BOLD,
  SIXTEEN,
  SUCCESS,
  TEN,
  TouchableOpacityView,
  YELLOW,
} from '../common';
import {Image, StyleSheet, View} from 'react-native';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import {colors} from '../theme/colors';
import {universalPaddingVertical} from '../theme/dimens';
import {completeIcon, profilePlaceholder} from '../helper/ImageAssets';
import NavigationService from '../navigation/NavigationService';
import {SUBMIT_REPORT_SCREEN} from '../navigation/routes';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {getCalendarData, getPatientDetails} from '../actions/authActions';
import {commonStyles} from '../theme/commonStyles';
import {getAge} from '../helper/utility';
import moment from 'moment';
import {IMAGE_BASE_URL} from '../helper/Constants';
import FastImage from 'react-native-fast-image';

export const ListEmptyComponent = ({title}: any) => {
  return (
    <View style={commonStyles.center}>
      <AppText>{title}</AppText>
    </View>
  );
};

const UpcomingContainer = ({item}) => {
  const {date, user, subscription, doctorFee} = item ?? '';
  const {name, avatar, dob} = user ?? '';
  return (
    <TouchableOpacityView style={[styles.scheduleContainerSecond]}>
      <View style={styles.scheduleContainer}>
        <FastImage
          source={avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder}
          resizeMode="cover"
          style={styles.scheduleIcon}
        />
        <View>
          <AppText weight={SEMI_BOLD}>{name}</AppText>
          <AppText weight={LIGHT} type={TEN} style={styles.ageTitle}>
            {getAge(dob)} years
          </AppText>
        </View>
      </View>
      <View style={styles.prescriptionContainer}>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          {subscription?.careHealthPlanName}
        </AppText>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          &#8377;{doctorFee}
        </AppText>
      </View>
      <AppText style={styles.bottomContainer} color={YELLOW} weight={MEDIUM}>
        Scheduled on{'  '}
        <AppText weight={SEMI_BOLD} type={FOURTEEN}>
          {moment(date).format('lll')}
        </AppText>
      </AppText>
    </TouchableOpacityView>
  );
};
const OngoingContainer = ({item}) => {
  const {user, doctorFee, subscription} = item ?? '';
  const {name, dob, avatar} = user ?? '';
  return (
    <TouchableOpacityView style={[styles.scheduleContainerSecond]}>
      <AppText color={ORANGE} weight={SEMI_BOLD} type={FOURTEEN}>
        Ongoing
      </AppText>
      <View style={[styles.scheduleContainer, styles.scheduleContainerOngoing]}>
        <FastImage
          source={avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder}
          resizeMode="cover"
          style={styles.scheduleIcon}
        />
        <View>
          <AppText weight={SEMI_BOLD}>{name}</AppText>
          <AppText weight={LIGHT} type={TEN} style={styles.ageTitle}>
            {getAge(dob)} years
          </AppText>
        </View>
      </View>
      <View
        style={[
          styles.prescriptionContainer,
          styles.prescriptionContainerOngoing,
        ]}>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          {subscription?.careHealthPlanName}
        </AppText>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          &#8377;{doctorFee}
        </AppText>
      </View>
    </TouchableOpacityView>
  );
};

const CompletedContainer = ({item}) => {
  const dispatch = useAppDispatch();
  const {date, reportSubmitted, subscription, doctorFee, user, _id} =
    item ?? '';
  const {name, dob, avatar} = user ?? '';

  const onSubmit = () => {
    dispatch(getPatientDetails(_id));
    NavigationService.navigate(SUBMIT_REPORT_SCREEN, {isComplete: true});
  };
  return (
    <TouchableOpacityView
      style={[
        styles.scheduleContainerSecond,
        {
          backgroundColor: colors.light_brown,
        },
      ]}>
      <View style={styles.completeFirst}>
        <FastImage
          resizeMode="contain"
          style={styles.completeIcon}
          source={completeIcon}
        />
        <AppText color={SUCCESS} weight={SEMI_BOLD}>
          Completed{'\n'}
          <AppText color={SUCCESS} type={TEN} weight={LIGHT}>
            On {moment(date).format('ddd, MMM YY')}
          </AppText>
        </AppText>
      </View>

      <View style={[styles.scheduleContainer, styles.scheduleContainerOngoing]}>
        <FastImage
          source={avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder}
          resizeMode="cover"
          style={styles.scheduleIcon}
        />
        <View style={commonStyles.flex}>
          <AppText weight={SEMI_BOLD}>{name}</AppText>
          <AppText weight={LIGHT} type={TEN} style={styles.ageTitle}>
            {getAge(dob)} years
          </AppText>
        </View>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          &#8377;{doctorFee}
        </AppText>
      </View>
      <View
        style={[
          styles.prescriptionContainer,
          styles.prescriptionContainerOngoing,
        ]}>
        <AppText type={FOURTEEN} weight={SEMI_BOLD}>
          {subscription?.careHealthPlanName}
        </AppText>
      </View>
      <Button
        onPress={() => onSubmit()}
        disabled={reportSubmitted}
        children="Submit Report"
        containerStyle={[
          styles.reportButton,
          reportSubmitted && {backgroundColor: colors.disabled_button},
        ]}
      />
    </TouchableOpacityView>
  );
};

const TabContainer = ({index}: any) => {
  const {calendarData, isLoading} = useAppSelector(state => state.auth);
  return (
    <KeyBoardAware>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {calendarData?.map(e => {
            return (
              <>
                {index === 0 ? (
                  <UpcomingContainer item={e} />
                ) : index === 1 ? (
                  <OngoingContainer item={e} />
                ) : (
                  <CompletedContainer item={e} />
                )}
              </>
            );
          })}
          {calendarData?.length === 0 && (
            <ListEmptyComponent title="Nothing to show" />
          )}
          <View style={{height: 50}} />
        </>
      )}
    </KeyBoardAware>
  );
};

export const RenderTabBar = (
  props: SceneRendererProps & {navigationState: NavigationState<any>},
) => {
  return (
    <TabBar
      {...props}
      renderLabel={({route, focused}) => (
        <View
          style={[
            {},
            focused && {
              borderBottomWidth: 3,
              height: 30,
              borderBottomColor: colors.primary,
            },
          ]}>
          <AppText
            weight={SEMI_BOLD}
            type={SIXTEEN}
            color={!focused ? BLACK : PRIMARY}>
            {route.title}
          </AppText>
        </View>
      )}
      indicatorStyle={{backgroundColor: colors.transparent}}
      pressColor={colors.transparent}
      style={[styles.tabbar]}
    />
  );
};

const Calendar = () => {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'upcoming', title: 'Upcoming'},
    {key: 'ongoing', title: 'Ongoing'},
    {key: 'completed', title: 'Completed'},
  ]);

  useEffect(() => {
    dispatch(
      getCalendarData(
        index === 0 ? 'Upcoming' : index === 1 ? 'Ongoing' : 'Completed',
      ),
    );
  }, [index]);

  const renderScene = SceneMap({
    upcoming: () => <TabContainer index={index} />,
    ongoing: () => <TabContainer index={index} />,
    completed: () => <TabContainer index={index} />,
  });
  return (
    <AppSafeAreaView>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={props => <RenderTabBar {...props} />}
        onIndexChange={setIndex}
        style={styles.container}
      />
    </AppSafeAreaView>
  );
};

export default Calendar;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabbar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
  scheduleContainerSecond: {
    backgroundColor: colors.white,
    elevation: 1,
    marginVertical: 10,
    borderRadius: 10,
    padding: universalPaddingVertical,
    borderWidth: 1,
    borderColor: colors.light_gray,
    shadowOpacity: 0.1,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIcon: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
  },
  dateTimeIcon: {
    height: 12,
    width: 12,
    marginEnd: 10,
  },
  dateTimeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '75%',
  },
  dateTimeSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageTitle: {
    // marginVertical: 8,
  },
  prescriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: colors.gray,
    borderBottomColor: colors.gray,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    marginTop: 10,
  },
  bottomContainer: {
    marginVertical: 8,
  },
  scheduleContainerOngoing: {
    borderTopColor: colors.gray,
    borderBottomColor: colors.gray,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    marginTop: 10,
  },
  prescriptionContainerOngoing: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5,
  },
  completeIcon: {
    height: 22,
    width: 22,
    marginEnd: 10,
  },
  completeFirst: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportButton: {
    marginTop: 0,
    marginVertical: 10,
  },
});
