import React, {useEffect} from 'react';
import {AppSafeAreaView, AppText, Loader, SEMI_BOLD, SIXTEEN} from '../common';
import {SectionList, StyleSheet, View} from 'react-native';
import {commonStyles} from '../theme/commonStyles';
import {colors} from '../theme/colors';
import {universalPaddingVertical} from '../theme/dimens';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {getNotificationList} from '../actions/authActions';
import {noNotification} from '../helper/ImageAssets';
import AnimatedLottieView from 'lottie-react-native';

const ListEmptyComponent = () => {
  return (
    <View style={commonStyles.center}>
      <AppText type={SIXTEEN} weight={SEMI_BOLD}>
        No Notifications
      </AppText>
      <AppText style={commonStyles.textAlign}>
        no new notifications, we will notify you{'\n'}once we have something for
        you
      </AppText>
      <AnimatedLottieView
        style={{height: 250, width: 250}}
        source={noNotification}
        autoPlay
        loop
      />
    </View>
  );
};

const Notification = () => {
  const dispatch = useAppDispatch();
  const {isLoading, notificationList} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(getNotificationList());
  }, []);

  return (
    <AppSafeAreaView>
      <View style={commonStyles.whiteBackgroundWithPadding}>
        <SectionList
          sections={notificationList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.item}>
              <AppText type={SIXTEEN} weight={SEMI_BOLD}>
                {item.title}
              </AppText>
              <AppText>{item.subtitle}</AppText>
            </View>
          )}
          renderSectionHeader={({section: {title, data}}) => (
            <AppText weight={SEMI_BOLD} type={SIXTEEN} style={styles.title}>
              {title}
            </AppText>
          )}
          ListEmptyComponent={isLoading ? <Loader /> : <ListEmptyComponent />}
          contentContainerStyle={commonStyles.flexGrow}
        />
      </View>
    </AppSafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  title: {
    marginVertical: 10,
  },
  item: {
    backgroundColor: colors.white,
    elevation: 1,
    marginVertical: 10,
    borderRadius: 10,
    padding: universalPaddingVertical,
    borderWidth: 1,
    borderColor: colors.light_gray,
    shadowOpacity: 0.1,
  },
  image: {
    height: 150,
    width: 200,
  },
});
