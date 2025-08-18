import { createSelector } from '@reduxjs/toolkit';

const selectUserState = (state) => state.user;

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

export const selectUserData = createSelector(
  [selectUser, selectToken, selectIsAuthenticated],
  (user, token, isAuthenticated) => ({
    user,
    token,
    isAuthenticated,
    userId: user?._id || null,
  })
);
