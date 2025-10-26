import axiosInstance from "./axiosInstance";
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

export const updatePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const res = await axiosInstance.patch('/auth/updatePassword', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const formData = new FormData();

  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await axiosInstance.patch('/auth/updateMe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
