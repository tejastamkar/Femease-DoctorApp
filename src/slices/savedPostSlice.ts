import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavedPostState {
  posts: any[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  isLoading: boolean;
}

const initialState: SavedPostState = {
  posts: [],
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
  isLoading: false,
};

const savedPostSlice = createSlice({
  name: "savedPosts",
  initialState,
  reducers: {
    setSavedIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSavedPostRes(state, action: PayloadAction<any>) {
      const { posts, currentPage, totalPages, totalPosts } = action.payload;
      state.posts = currentPage === 1 ? posts : [...state.posts, ...posts];
      state.currentPage = currentPage;
      state.totalPages = totalPages;
      state.totalPosts = totalPosts;
    },
    setSavedLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedCommentLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedCommentReplyLikePost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedCommentPost(state, action: PayloadAction<{ post: string }>) {
      const { post } = action.payload;
      const postIndex = state.posts.findIndex((postData) => postData._id === post);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(action.payload);
      }
    },
    setSavedCommentReplyPost(state, action: PayloadAction<{ post: string, parentComment: string }>) {
      const { post, parentComment } = action.payload;
      const postIndex = state.posts.findIndex((postData) => postData._id === post);
      if (postIndex !== -1) {
        const comment = state.posts[postIndex].comments.find((comment: any) => comment?._id == parentComment)
        comment.replies.push(action.payload)
      }
    },
    setSavedBookmarkPost(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedTurnOffComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedDeleteComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
    setSavedDeleteReplyComment(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    },
  }
});

export const { setSavedIsLoading, setSavedPostRes, setSavedLikePost, setSavedCommentLikePost, setSavedCommentReplyLikePost, setSavedCommentPost, setSavedCommentReplyPost, setSavedBookmarkPost, setSavedTurnOffComment, setSavedDeleteComment, setSavedDeleteReplyComment } = savedPostSlice.actions;
export default savedPostSlice.reducer;
