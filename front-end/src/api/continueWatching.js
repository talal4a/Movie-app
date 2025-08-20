import axiosInstance from './axiosInstance';

export const markAsWatched = (movieId) => {
  return axiosInstance.post('/continue-watching', { movieId });
};
export const getContinueWatching = () => {
  return axiosInstance.get('/continue-watching').then((res) => res.data.list);
};
export const removeFromContinueWatching = async (movieId) => {
  try {
    const res = await axiosInstance.delete(`/continue-watching/${movieId}`);
    return res.data;
  } catch (error) {
    console.error('Error removing from continue watching:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
