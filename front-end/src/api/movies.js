import axiosInstance from './axioInstance';

export const getMoviesByCollection = async (collectionName) => {
  try {
    const response = await axiosInstance.get(
      `movies/collection/${collectionName}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching collection movies:', error);
    return [];
  }
};
export const getRelatedMovies = async (id) => {
  try {
    const res = await axiosInstance.get(`movies/related/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return { data: [] };
  }
};
export const fetchMovies = async () => {
  const res = await axiosInstance.get('/movies/featured');
  return res.data.data;
};
export const getAllMovies = async () => {
  const res = await axiosInstance.get('/movies?sort=createdAt&limit=6');
  return res.data.data;
};
export const getMoviesByTag = async (tag) => {
  const allMovies = await getAllMovies();
  return allMovies.filter((movie) => movie.tags?.includes(tag));
};
export const fetchLatestMovies = async () => {
  const res = await axiosInstance.get(
    '/movies?sort=-createdAt&limit=6&excludeCollection=true'
  );
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
export const searchMovies = async (query) => {
  const response = await axiosInstance.get(`/movies`, {
    params: { search: query },
  });
  return response.data.data;
};