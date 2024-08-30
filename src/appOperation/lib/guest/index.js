import {GUEST_TYPE} from '../../types';

export default appOperation => ({
  send_otp: data => appOperation.post(`users/doctor-login`, data, GUEST_TYPE),
  verify_otp: data =>
    appOperation.post(`users/doctor-otp-verification`, data, GUEST_TYPE),
  resend_otp: data => appOperation.post(`users/resend-otp`, data, GUEST_TYPE),
});
