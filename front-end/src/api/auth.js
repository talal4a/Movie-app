import axios from 'axios';
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
export const fetchMovies = async () => {
  const res = await axiosInstance.get('/movies/featured');
  return res.data.data;
};
export const getAllMovies = async () => {
  const res = await axiosInstance.get('/movies?sort=createdAt&limit=6');
  return res.data.data;
};
export const fetchLatestMovies = async () => {
  const res = await axiosInstance.get('/movies?sort=-createdAt&limit=6');
  return res.data.data;
};
export const fetchMoviesByGenre = async (genre) => {
  const res = await axiosInstance.get(`/movies?genre=${genre}&limit=6`);
  return res.data.data;
};
export const getMovieById = async (id) => {
  const res = await axiosInstance.get(`/movies/${id}`);
  return res.data.data;
};
export const getReviewsByMovieId = async (movieId) => {
  const res = await axiosInstance.get(`movies/${movieId}/reviews`);
  return res.data;
};
export const postReviews = async (movieId, reviewData) => {
  const res = await axiosInstance.post(`movies/${movieId}/reviews`, reviewData);
  return res.data;
};
