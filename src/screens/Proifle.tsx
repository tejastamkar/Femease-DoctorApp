import React, {useState} from 'react';
import {
  AppSafeAreaView,
  AppText,
  Button,
  FOURTEEN,
  MEDIUM,
  PRIMARY,
  SEMI_BOLD,
  SIXTEEN,
  TouchableOpacityView,
  TWENTY,
  WHITE,
} from '../common';
import {Image, StyleSheet, View} from 'react-native';
import {commonStyles} from '../theme/commonStyles';
import {editIcon, profilePlaceholder, starIcon} from '../helper/ImageAssets';
import {Rating} from '@kolking/react-native-rating';
import {colors} from '../theme/colors';
import {SceneMap, TabView} from 'react-native-tab-view';
import {ListEmptyComponent, RenderTabBar} from './Calendar';
import NavigationService from '../navigation/NavigationService';
import {EDIT_PROFILE_SCREEN} from '../navigation/routes';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {IMAGE_BASE_URL} from '../helper/Constants';
import {borderWidth, universalPaddingVertical} from '../theme/dimens';
import {logOut} from '../actions/authActions';
import FastImage from 'react-native-fast-image';

const OverviewContainer = () => {
  const {userData} = useAppSelector(state => state.auth);
  const {specializations, briefBio} = userData ?? '';

  return (
    <View>
      <View style={styles.aboutContainer}>
        <AppText type={SIXTEEN} weight={SEMI_BOLD}>
          About{'\n'}
          {'\n'}
          <AppText type={FOURTEEN}>{briefBio}</AppText>
        </AppText>
      </View>
      <View style={styles.aboutContainer}>
        <AppText type={SIXTEEN} weight={SEMI_BOLD}>
          Area of expertise{'\n'}
          {'\n'}
          <AppText type={FOURTEEN}>{specializations}</AppText>
        </AppText>
      </View>
    </View>
  );
};
const FeedbackContainer = () => {
  const {userData} = useAppSelector(state => state.auth);
  const {ratingsAndReviews} = userData ?? '';
  return (
    <View style={commonStyles.whiteBackgroundWithOutPadding}>
      {ratingsAndReviews?.map((e, index) => {
        return (
          <View style={styles.ratingContainer} key={index}>
            <View style={styles.ratingContainerSecond}>
              <FastImage
                source={
                  e?.userAvatar
                    ? {uri: IMAGE_BASE_URL + e?.userAvatar}
                    : profilePlaceholder
                }
                resizeMode="cover"
                style={styles.ratingUser}
              />
              <View>
                <AppText weight={MEDIUM} type={FOURTEEN}>
                  {e?.userName}
                </AppText>
                <View style={styles.ratingContainerThird}>
                  <AppText color={WHITE} weight={MEDIUM}>
                    {e?.ratings}
                  </AppText>
                  <FastImage
                    source={starIcon}
                    resizeMode="contain"
                    style={styles.starIcon}
                  />
                </View>
              </View>
            </View>
            <AppText>{e?.comments}</AppText>
          </View>
        );
      })}
      {ratingsAndReviews?.length === 0 && (
        <ListEmptyComponent title="No Feedbacks yet" />
      )}
    </View>
  );
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const {userData, homeData} = useAppSelector(state => state.auth);
  const {name, yearsOfExperience, educationQualification, averageRating} =
    userData ?? '';
  const {data: _data} = homeData ?? '';
  const {avatar} = _data ?? '';
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'overview', title: 'Overview'},
    {key: 'feedback', title: 'Feedback'},
  ]);

  const renderScene = SceneMap({
    overview: () => <OverviewContainer />,
    feedback: () => <FeedbackContainer />,
  });
  return (
    <AppSafeAreaView>
      <View style={commonStyles.whiteBackgroundWithPadding}>
        <View style={styles.headerContainer}>
          <View>
            <AppText type={TWENTY} weight={SEMI_BOLD}>
              {name}
            </AppText>
            <AppText type={SIXTEEN} style={styles.qualificationTitle}>
              {educationQualification}
            </AppText>
            <AppText type={FOURTEEN} weight={SEMI_BOLD} color={PRIMARY}>
              {yearsOfExperience} Years Exp.
            </AppText>
          </View>
          <TouchableOpacityView onPress={() => {NavigationService.navigate(EDIT_PROFILE_SCREEN);}}>
          <View style={styles.headerContainerSecond}>
            <View>
            <FastImage
              source={
                avatar ? {uri: IMAGE_BASE_URL + avatar} : profilePlaceholder
              }
              resizeMode="cover"
              style={styles.profilePicture}
            />
            <FastImage
                source={editIcon}
                resizeMode="contain"
                style={styles.editIcon}
              />
            </View>
            {averageRating && (
              <Rating
                size={12}
                rating={averageRating}
                disabled
                fillColor={colors.primary}
              />
            )}
          </View>
          </TouchableOpacityView>
        </View>
        <View style={styles.divider} />
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={props => <RenderTabBar {...props} />}
          onIndexChange={setIndex}
        />
        <View>
          {/* <Button
            children="Edit Profile"
            onPress={() => {
              NavigationService.navigate(EDIT_PROFILE_SCREEN);
            }}
          /> */}
          <Button
            children="Logout"
            onPress={() => {
              dispatch(logOut());
            }}
          />
        </View>
      </View>
    </AppSafeAreaView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  editIcon: {
    height: 20,
    width: 20,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
  },
  headerContainerSecond: {
    alignItems: 'center',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 20,
  },
  qualificationTitle: {
    marginVertical: 5,
  },
  aboutContainer: {
    marginTop: 20,
    backgroundColor: colors.white,
    elevation: 1,
    padding: universalPaddingVertical,
    borderRadius: 10,
    borderWidth: borderWidth,
    borderColor: colors.lightest_gray,
    shadowOpacity: 0.1,
  },
  ratingContainer: {
    marginTop: 20,
  },
  ratingUser: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginEnd: 10,
  },
  ratingContainerSecond: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    height: 12,
    width: 12,
    marginStart: 5,
  },
  ratingContainerThird: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
