import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/userSlice';
import watchlistReducer from './slice/watchListSlice';

const store = configureStore({
  reducer: {
    user: authReducer,
    watchList: watchlistReducer,
  },
});

export default store;
