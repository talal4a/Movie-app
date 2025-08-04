import { createSelector } from '@reduxjs/toolkit';

// Select the user slice from the Redux state
const selectUserState = (state) => state.user;

// Create memoized selectors
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState?.user || null
);

export const selectToken = createSelector(
  [selectUserState],
  (userState) => userState?.token || null
);

export const selectIsAuthenticated = createSelector(
  [selectToken],
  (token) => !!token
);

// Combined selector for user-related data
export const selectUserData = createSelector(
  [selectUser, selectToken, selectIsAuthenticated],
  (user, token, isAuthenticated) => ({
    user,
    token,
    isAuthenticated,
    userId: user?._id || null
  })
);
