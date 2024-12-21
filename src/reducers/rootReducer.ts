import authReducer from '../slices/authSlice';
import postReducer from '../slices/postSlice';
import savedPostReducer from '../slices/savedPostSlice';
import {combineReducers} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  savedPost: savedPostReducer,
});

export default rootReducer;
