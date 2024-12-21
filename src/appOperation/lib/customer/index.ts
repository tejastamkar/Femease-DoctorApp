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
  updateReport: (data: any) =>
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
  get_forum_post: (page: number) =>
    appOperation.get(
      `forums/posts?page=${page}&limit=10`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  get_bookmarked_post: (page: number) =>
    appOperation.get(
      `forums/users/bookmarked-posts?page=${page}&limit=10`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  get_post: (postId: string) =>
    appOperation.get(
      `forums/posts/${postId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  post_create_post: (data: FormData) =>
    appOperation.post(`forums/posts`, data, CUSTOMER_TYPE),
  post_askQuestion: (data: FormData) =>
    appOperation.post(`forums/ask-question`, data, CUSTOMER_TYPE),
  get_forum_search: (page: number, searchQuery?: string, category?: string) => {
    if (category === 'All') category = undefined;
    if (page && searchQuery && category) {
      return appOperation.get(
        `forums/posts/search?query=${searchQuery}&page=${page}&limit=10&category=${category}`,
        undefined,
        undefined,
        CUSTOMER_TYPE,
      );
    }
    if (page && searchQuery) {
      return appOperation.get(
        `forums/posts/search?query=${searchQuery}&page=${page}&limit=10`,
        undefined,
        undefined,
        CUSTOMER_TYPE,
      );
    }
    if (page && category) {
      return appOperation.get(
        `forums/posts/search?page=${page}&limit=10&category=${category}`,
        undefined,
        undefined,
        CUSTOMER_TYPE,
      );
    }
  },
  post_like_post: (postId: string) =>
    appOperation.post(`forums/posts/${postId}/like`, {}, CUSTOMER_TYPE),
  post_comment_post: (data: any) =>
    appOperation.post(`forums/posts/${data._id}/comment`, data, CUSTOMER_TYPE),
  post_comment_reply_post: (parentCommentId: string, data: any) =>
    appOperation.post(
      `forums/comments/${parentCommentId}/replies`,
      data,
      CUSTOMER_TYPE,
    ),
  post_comment_Like: (commentId: string) =>
    appOperation.post(
      `forums/comments/${commentId}/like`,
      undefined,
      CUSTOMER_TYPE,
    ),
  post_comment_reply_Like: (replyId: string, parentCommentId: string) =>
    appOperation.post(
      `forums/comments/${parentCommentId}/replies/${replyId}/like`,
      undefined,
      CUSTOMER_TYPE,
    ),
  post_comment_off: (postId: string) =>
    appOperation.patch(
      `forums/posts/${postId}/toggle-commenting`,
      {},
      CUSTOMER_TYPE,
    ),
  delete_post: (postId: string) =>
    appOperation.delete(`forums/posts/${postId}`, {}, CUSTOMER_TYPE),
  delete_comment: (commentId: string) =>
    appOperation.delete(
      `forums/comments/${commentId}`,
      undefined,
      CUSTOMER_TYPE,
    ),
  delete_reply_comment: (commentId: string, replyId: string) =>
    appOperation.delete(
      `forums/comments/${commentId}/replies/${replyId}`,
      undefined,
      CUSTOMER_TYPE,
    ),
  post_report: (postId: string, data: any) =>
    appOperation.post(`forums/posts/${postId}/report`, data, CUSTOMER_TYPE),
  post_not_interested: (postId: string, data: any) =>
    appOperation.post(
      `forums/${postId}/mark-not-interested`,
      data,
      CUSTOMER_TYPE,
    ),
  post_bookmark: (postId: string) =>
    appOperation.post(`forums/posts/${postId}/bookmark`, {}, CUSTOMER_TYPE),
  post_edit_post: (postId: string, data: FormData) =>
    appOperation.put(`forums/posts/${postId}`, data, CUSTOMER_TYPE),
  post_poll_answer: (pollId: string, data: any) =>
    appOperation.post(`forums/submit/poll/${pollId}`, data, CUSTOMER_TYPE),
  post_quiz_answer: (quizQuestionId: string, data: any) =>
    appOperation.post(
      `forums/submit/quiz/${quizQuestionId}`,
      data,
      CUSTOMER_TYPE,
    ),
  blog_categories: () =>
    appOperation.get(
      `blogs/active-category`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  active_blogs: (blogId: string) =>
    appOperation.get(
      `blogs/active-blogs/${blogId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
});
