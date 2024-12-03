import {CUSTOMER_TYPE} from '../../types';
import {AppOperation} from './../../index';

export default (appOperation: AppOperation) => ({
  user_profile: () =>
    appOperation.get('doctor/profile', undefined, undefined, CUSTOMER_TYPE),
  home: () => appOperation.get('doctor', undefined, undefined, CUSTOMER_TYPE),
  patient_details: (appointmentId: string) =>
    appOperation.get(
      `doctor/appointment/${appointmentId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  agora_details: (userId: string, appointmentId: string) =>
    appOperation.get(
      `users/token?channelName=femease&user_id=${userId}&appointment_id=${appointmentId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  upload_image: (data: FormData) =>
    appOperation.post('users/image', data, CUSTOMER_TYPE),
  update_profile: (data: any) =>
    appOperation.put('users/update', data, CUSTOMER_TYPE),
  upload_pdf: (data: FormData) =>
    appOperation.post('users/pdf', data, CUSTOMER_TYPE),
  submit_report: (data: any) =>
    appOperation.patch('doctor/submit-report', data, CUSTOMER_TYPE),
  updateReport:(data: any)=>
    appOperation.put('doctor/update-report', data, CUSTOMER_TYPE),
  calendar_data: (status: string) =>
    appOperation.get(
      `doctor/appointment-type?status=${status}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  update_call: (data: any) =>
    appOperation.post('subscription/appointment-status', data, CUSTOMER_TYPE),
  logout: () => appOperation.post('users/logout', {}, CUSTOMER_TYPE),
  notification_list: () =>
    appOperation.get(
      `users/notification-list`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
});
