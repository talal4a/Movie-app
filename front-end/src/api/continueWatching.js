import axiosInstance from './axioInstance';
export const markAsWatched = (movieId) => {
  return axiosInstance.post('/continue-watching', { movieId });
};
export const getContinueWatching = () => {
  return axiosInstance.get('/continue-watching').then((res) => res.data.list);
};
export const removeFromContinueWatching = async (movieId) => {
  const res = await axiosInstance.delete(`/continue-watching/${movieId}`);
  return res.data;
};
