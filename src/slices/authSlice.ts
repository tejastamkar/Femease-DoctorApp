import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  userData: undefined,
  homeData: undefined,
  upComingAppointment: [],
  completedAppointment: [],
  patientDetails: undefined,
  agoraDetails: undefined,
  isLoginModal: false,
  calendarData: [],
  notificationList: [],
  isConfettiVisibleState: false,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      state.isLoading = payload;
    },
    setUserData: (state, {payload}) => {
      state.userData = payload;
    },
    setHomeData: (state, {payload}) => {
      state.homeData = payload;
    },
    setPatientDetails: (state, {payload}) => {
      state.patientDetails = payload;
    },
    setAgoraDetails: (state, {payload}) => {
      state.agoraDetails = payload;
    },
    setCalendarData: (state, {payload}) => {
      state.calendarData = payload;
    },
    setNotificationList: (state, {payload}) => {
      state.notificationList = payload;
    },
    setIsLoginModal: (state, {payload}) => {
      state.isLoginModal = payload;
    },
    resetAuth: state => {
      state = undefined;
    },
    setIsConfettiVisibleState: (state, {payload}) => {
      state.isConfettiVisibleState = payload;
    },
  },
});

export const {
  setLoading,
  setUserData,
  resetAuth,
  setHomeData,
  setPatientDetails,
  setIsLoginModal,
  setAgoraDetails,
  setCalendarData,
  setNotificationList,
  setIsConfettiVisibleState,
} = authSlice.actions;

export default authSlice.reducer;
