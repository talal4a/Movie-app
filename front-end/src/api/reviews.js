import axiosInstance from "./axioInstance";

export const postReviews = async (movieId, reviewData) => {
  const res = await axiosInstance.post(
    `/movies/${movieId}/reviews`,
    reviewData
  );
  return res.data;
};
export const upsertReviews = async (movieId, reviewData) => {
  const res = await axiosInstance.patch(
    `/movies/${movieId}/reviews`,
    reviewData
  );
  return res.data;
};
export const deleteReview = async (movieId) => {
  const res = await axiosInstance.delete(`/movies/${movieId}/reviews`);
  return res.data;
};
