import axiosInstance from '@/api/axiosInstance';
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    if (profileData.name) {
      formData.append('name', profileData.name);
    }
    if (profileData.photo) {
      formData.append('avatar', profileData.photo);
    }
    const res = await axiosInstance.patch(`/account/updateMe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.status !== 'success') {
      throw new Error(res.data.message || 'Failed to update profile');
    }
    return res.data.data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
export const updatePassword = async (passwordData) => {
  const res = await axiosInstance.patch(
    '/account/updateMyPassword',
    passwordData
  );
  if (res.data.status !== 'success') {
    throw new Error(res.data.message || 'Failed to update password');
  }
  return res.data.data;
};
