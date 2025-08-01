import axiosInstance from './axioInstance';

export const signup = async ({ name, email, password, confirmPassword }) => {
  const res = await axiosInstance.post('/auth/signup', {
    name,
    email,
    password,
    confirmPassword,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return res.data;
};

export const forgotPassword = async ({ email }) => {
  const res = await axiosInstance.post('/auth/forgotPassword', {
    email,
  });
  return res.data;
};
export const resetPassword = async ({ token, password, confirmPassword }) => {
  const res = await axiosInstance.patch(`/auth/resetPassword/${token}`, {
    password,
    confirmPassword,
  });
  return res.data;
};
