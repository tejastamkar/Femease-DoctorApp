import AsyncStorage from '@react-native-async-storage/async-storage';
import {appOperation} from '../appOperation';
import {logError, showError} from '../helper/logger';
import NavigationService from '../navigation/NavigationService';
import {
  NAVIGATION_AUTH_STACK,
  NAVIGATION_BOTTOM_TAB_STACK,
  OTP_VERIFY_SCREEN,
} from '../navigation/routes';
import {
  resetAuth,
  setAgoraDetails,
  setCalendarData,
  setHomeData,
  setLoading,
  setNotificationList,
  setPatientDetails,
  setUserData,
} from '../slices/authSlice';
import {AppDispatch} from '../store/store';
import {FCM_TOKEN_KEY, USER_TOKEN_KEY} from '../helper/Constants';

export interface SendOtpProps {
  phone: string;
}

export interface VerifyOtpProps {
  userId: string;
  otp: string;
}
export const sendOtp =
  (data: SendOtpProps) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.guest.send_otp(data);

      if (response?.success) {
        dispatch(setUserData(response.data));
        NavigationService.navigate(OTP_VERIFY_SCREEN);
      }
      showError(response?.message);
    } catch (e) {
      showError(e?.message || 'An unexpected error occurred');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const ReSendOtp =
  (data: SendOtpProps) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.guest.resend_otp(data);

      showError(response?.message);
    } catch (e) {
      showError(e?.message || 'An unexpected error occurred');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const verifyOtp =
  (data: VerifyOtpProps) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.guest.verify_otp(data);

      if (response?.success) {
        dispatch(setUserData(response.data));
        appOperation.setCustomerToken(response?.data?.access_token);
        await AsyncStorage.setItem(
          USER_TOKEN_KEY,
          response?.data?.access_token,
        );
        dispatch(getUserProfile());
      }
      showError(response?.message);
    } catch (e) {
      showError(e?.message || 'An unexpected error occurred');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getUserProfile =
  (isNavigate = true) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.customer.user_profile();

      if (response?.success) {
        dispatch(setUserData(response.data));
        if (!isNavigate) {
          return;
        }
        dispatch(getHomeData());
        NavigationService.reset(NAVIGATION_BOTTOM_TAB_STACK);
      }
    } catch (e) {
      logError(e);
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getHomeData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.home();

    if (response?.success) {
      dispatch(setHomeData(response));
    }
  } catch (e) {
    logError(e);
    dispatch(logoutUsers(e?.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getPatientDetails =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.customer.patient_details(id);

      if (response?.success) {
        dispatch(setPatientDetails(response?.data));
      }
    } catch (e) {
      logError(e);
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAgoraDetails =
  (userId: string, appointmentId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.customer.agora_details(
        userId,
        appointmentId,
      );

      if (response?.success) {
        dispatch(setAgoraDetails(response?.data));
      }
    } catch (e) {
      logError(e);
      dispatch(logoutUsers(e?.message));
      showError(e?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const uploadImage =
  (data: FormData, id: string, profileData: any, setData?: any) =>
  async (dispatch: AppDispatch) => {
    try {
      id ? null : dispatch(setLoading(true));
      const response = await appOperation.customer.upload_image(data);
      console.log('res:::::::', response);

      if (response?.success) {
        if (id) {
          let _data = {
            user_id: id,
            avatar: response?.data['0']?.path,
          };

          dispatch(updateProfile(_data, false));
        } else if (profileData) {
          profileData['certification'] = response?.data['0']?.path;
          dispatch(updateProfile(profileData, true));
        } else {
          setData(response?.data['0']?.path);
        }
      } else {
        showError(response?.message);
      }
    } catch (e) {
      logError(e);
      showError(e?.response?.data?.message || 'Something went wrong');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateProfile =
  (data: any, isNavigate = true, isAlert = true) =>
  async (dispatch: AppDispatch) => {
    try {
      data['fcmToken'] = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      dispatch(setLoading(true));
      const response = await appOperation.customer.update_profile(data);

      if (response?.success) {
        isNavigate ? showError(response?.message) : null;
        dispatch(getUserProfile(isNavigate));
      } else {
        isAlert ? showError(response?.message) : null;
      }
    } catch (e) {
      logError(e);
      showError(e?.response?.data?.message || 'Something went wrong');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const uploadPdf =
  (data: FormData, setPdf: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await appOperation.customer.upload_pdf(data);

      if (response?.success) {
        setPdf(response?.data?.path);
      } else {
        showError(response?.message);
      }
    } catch (e) {
      logError(e);
      showError(e?.response?.data?.message || 'Something went wrong');
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const submitReport = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.submit_report(data);

    if (response?.success) {
      NavigationService.navigate('Calendar');
      dispatch(getCalendarData('Completed'));
    } else {
      showError(response?.message);
    }
  } catch (e) {
    logError(e);
    showError(e?.response?.data?.message || 'Something went wrong');
    dispatch(logoutUsers(e?.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getCalendarData =
  (status: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setCalendarData([]));
      dispatch(setLoading(true));
      const response = await appOperation.customer.calendar_data(status);

      if (response?.success) {
        dispatch(setCalendarData(response?.data));
      }
    } catch (e) {
      logError(e);
      dispatch(logoutUsers(e?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateCallStatus =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      const response = await appOperation.customer.update_call(data);
      if (response?.success) {
        dispatch(getHomeData());
        dispatch(getCalendarData('Upcoming'));
      }
    } catch (e) {
      logError(e);
      dispatch(logoutUsers(e?.message));
    }
  };

export const getNotificationList = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.notification_list();

    if (response?.success) {
      dispatch(setNotificationList(response?.data));
    }
  } catch (e) {
    logError(e);
    dispatch(logoutUsers(e?.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logOut = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response: any = await appOperation.customer.logout();

    if (response?.success) {
      AsyncStorage.removeItem(USER_TOKEN_KEY);
      dispatch(resetAuth());

      NavigationService.reset(NAVIGATION_AUTH_STACK);
    }
  } catch (e: any) {
    AsyncStorage.removeItem(USER_TOKEN_KEY);
    NavigationService.reset(NAVIGATION_AUTH_STACK);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUsers = (message: any) => async (dispatch: AppDispatch) => {
  try {
    if (
      message == 'User is deactivated!' ||
      message == 'Your account is no more active.' ||
      message == 'Unauthenticated!' ||
      message == 'Internal Server Error'
    ) {
      dispatch(logOut());
    }
  } catch (e) {
    logError(e);
  }
};
