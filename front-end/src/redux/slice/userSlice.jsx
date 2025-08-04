import { createSlice } from '@reduxjs/toolkit';
const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
  const userData = localStorage.getItem('user');
  storedUser =
    userData && userData !== 'undefined' ? JSON.parse(userData) : null;
} catch (err) {
  storedUser = null;
}
const initialState = {
  user: storedUser,
  token: storedToken || null,
  loading: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      if (user?._id) {
        localStorage.setItem('userId', user._id);
      }
    },
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      state.user = null;
      state.token = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
      if (action.payload?._id) {
        localStorage.setItem('userId', action.payload._id);
      }
    },
  },
});
export const {
  setCredentials,
  logout,
  setLoading,
  updateUser,
  updateProfilePhoto,
} = authSlice.actions;
export default authSlice.reducer;
