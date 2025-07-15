import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/userSlice';
export const store = configureStore({
  reducer: {
    user: authReducer,
  },
});
