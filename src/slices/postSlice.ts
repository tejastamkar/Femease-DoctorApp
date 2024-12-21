import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: any[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  isLoading: boolean;
}

const initialState: PostState = {
  posts: [],
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
  isLoading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setPostRes(state, action: PayloadAction<any>) {
      const { posts, currentPage, totalPages, totalPosts } = action.payload;
      state.posts = currentPage === 1 ? posts : [...state.posts, ...posts];
      state.currentPage = currentPage;
      state.totalPages = totalPages;
      state.totalPosts = totalPosts;
    },
    setUpdatePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setCommentPost(state, action: PayloadAction<{ post: string }>) {
      const { post } = action.payload;
      const postIndex = state.posts.findIndex((postData) => postData._id === post);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(action.payload);
      }
    },
    setCommentReplyPost(state, action: PayloadAction<{ post: string, parentComment: string }>) {
      const { post, parentComment } = action.payload;
      const postIndex = state.posts.findIndex((postData) => postData._id === post);
      if (postIndex !== -1) {
        const comment = state.posts[postIndex].comments.find((comment: any) => comment?._id == parentComment)
        comment.replies.push(action.payload)
      }
    },
    setCommentLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setCommentReplyLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setDeleteComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setDeleteReplyComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setBookmarkPost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setTurnOffComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setPollAnswer(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setQuizAnswer(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    }
  }
});

export const { setIsLoading, setPostRes, setUpdatePost, setLikePost, setCommentPost, setCommentReplyPost, setCommentLikePost, setCommentReplyLikePost, setDeleteComment, setDeleteReplyComment, setBookmarkPost, setTurnOffComment, setPollAnswer, setQuizAnswer } = postSlice.actions;
export default postSlice.reducer;
