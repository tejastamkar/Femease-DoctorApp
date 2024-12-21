/* eslint-disable react/no-unstable-nested-components */
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import NavigationService from './NavigationService';
import * as routes from './routes';
import * as React from 'react';
import {colors} from '../theme/colors';
import {commonStyles} from '../theme/commonStyles';
import {Platform} from 'react-native';
import Login from '../screens/Login';
import OtpVerify from '../screens/OtpVerify';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {fontFamily} from '../theme/typography';
import Home from '../screens/Home';
import {
  fam,
  tabCalendar,
  tabHome,
  tabNotification,
  tabProfile,
} from '../helper/ImageAssets';
import Calendar from '../screens/Calendar';
import Notification from '../screens/Notification';
import Profile from '../screens/Proifle';
import PatientDetails from '../screens/PatientDetails';
// import AppointmentDetails from '../screens/AppointmentDetails';
import EditProfile from '../screens/EditProfile';
// import ExpertsList from '../screens/ExpertsList';
import CallingScreen from '../screens/CallingScreen';
import SubmitReport from '../screens/SubmitReport';
import FastImage from 'react-native-fast-image';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthLoading from '../screens/AuthLoading';
import ForumList from '../screens/forum/ForumList';
import SavedPosts from '../screens/forum/SavedPosts';
import {ForumMain} from '../screens/forum';

interface TabBarIconProps {
  source: number | undefined;
  focused: boolean | undefined;
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarIcon = ({source, focused}: TabBarIconProps) => {
  return (
    <FastImage
      source={source}
      resizeMode="contain"
      style={commonStyles.tabIcon}
      tintColor={focused ? colors.primary : colors.black}
    />
  );
};

const MyAuthLoadingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name={routes.NAVIGATION_AUTH_LOADING_SCREEN}
      component={AuthLoading}
    />
    <Stack.Screen name={routes.NAVIGATION_AUTH_STACK} component={AuthStack} />
    <Stack.Screen
      name={routes.NAVIGATION_BOTTOM_TAB_STACK}
      component={BottomTab}
    />
    <Stack.Screen name={routes.PATIENT_SCREEN} component={PatientDetails} />
    <Stack.Screen
      name={routes.FORUM}
      options={{headerShown: false}}
      component={ForumMain}
    />
    <Stack.Screen
      name={routes.FORUM_LIST}
      options={{headerShown: false}}
      component={ForumList}
    />

    <Stack.Screen
      name={routes.SAVED_POSTS}
      options={{headerShown: false}}
      component={SavedPosts}
    />
    <Stack.Screen name={routes.EDIT_PROFILE_SCREEN} component={EditProfile} />
    <Stack.Screen name={routes.NOTIFICATION_SCREEN} component={Notification} />
    <Stack.Screen name={routes.CALLING_SCREEN} component={CallingScreen} />
    <Stack.Screen name={routes.SUBMIT_REPORT_SCREEN} component={SubmitReport} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={routes.WELCOME_SCREEN} component={WelcomeScreen} />
    <Stack.Screen name={routes.LOGIN_SCREEN} component={Login} />
    <Stack.Screen name={routes.OTP_VERIFY_SCREEN} component={OtpVerify} />
  </Stack.Navigator>
);

const BottomTab = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 1,
        height: Platform.OS === 'android' ? 65 : 80,
        paddingTop: 5,
        elevation: 5,
        shadowOpacity: 0.1,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.black,
      tabBarShowLabel: true,
      tabBarLabelStyle: {
        position: 'absolute',
        bottom: 8,
        fontSize: 12,
        textAlign: 'center',
        paddingBottom: 7,
        fontFamily: fontFamily,
      },
      tabBarItemStyle: {
        height: 65,
        width: '100%',
        paddingTop: 0,
        paddingBottom: 25,
      },
    }}>
    <Tab.Screen
      name={'Home'}
      component={Home}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon source={tabHome} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={'Calendar'}
      component={Calendar}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon source={tabCalendar} focused={focused} />
        ),
      }}
    />
    {/* <Tab.Screen
      name={'Notification'}
      component={Notification}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon source={tabNotification} focused={focused} />
        ),
      }}
    /> */}
    <Tab.Screen
      name="ForumList"
      component={ForumList}
      options={{
        title: 'Forum',
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <TabBarIcon source={fam} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={'Profile'}
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon source={tabProfile} focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Navigator = () => {
  return (
    <NavigationContainer
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}>
      <MyAuthLoadingStack />
    </NavigationContainer>
  );
};

export default Navigator;
