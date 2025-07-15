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
  const res = await axiosInstance.get(`/movies/${movieId}/reviews`);
  return res.data;
};

export const postReviews = async (movieId, reviewData) => {
  const res = await axiosInstance.post(
    `/movies/${movieId}/reviews`,
    reviewData
  );
  return res.data;
};
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
