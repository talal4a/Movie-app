import axiosInstance from "./axiosInstance";

const getAuthHeader = (token) => ({
  Authorization: token ? `Bearer ${token}` : '',
});
export const getMoviesByCollection = async (collectionName, token) => {
  try {
    const response = await axiosInstance.get(
      `movies/collection/${collectionName}`,
      { headers: getAuthHeader(token) }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching collection movies:', error);
    return [];
  }
};

export const getRelatedMovies = async (id, token) => {
  try {
    const res = await axiosInstance.get(`movies/related/${id}`, {
      headers: getAuthHeader(token),
    });
    return res.data.data || [];
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return [];
  }
};

export const fetchMovies = async (token) => {
  const res = await axiosInstance.get('/movies/featured', {
    headers: getAuthHeader(token),
  });
  return res.data.data || [];
};

export const getAllMovies = async (token) => {
  const res = await axiosInstance.get('/movies', {
    params: { sort: 'createdAt', limit: 6 },
    headers: getAuthHeader(token),
  });
  return res.data.data || [];
};

export const getMoviesByTag = async (tag, token) => {
  const allMovies = await getAllMovies(token);
  return allMovies.filter((movie) => movie.tags?.includes(tag));
};

export const fetchLatestMovies = async (token) => {
  const res = await axiosInstance.get('/movies', {
    params: { sort: '-createdAt', limit: 6, excludeCollection: true },
    headers: getAuthHeader(token),
  });
  return res.data.data || [];
};

export const fetchMoviesByGenre = async (genre, token) => {
  const res = await axiosInstance.get('/movies', {
    params: { genre, limit: 6 },
    headers: getAuthHeader(token),
  });
  return res.data.data || [];
};

export const getMovieById = async (id, token) => {
  const res = await axiosInstance.get(`/movies/${id}`, {
    headers: getAuthHeader(token),
  });
  return res.data.data || null;
};

export const getReviewsByMovieId = async (movieId, token) => {
  try {
    const res = await axiosInstance.get(`/movies/${movieId}/reviews`, {
      headers: token ? getAuthHeader(token) : {},
    });
    // The backend returns { status: "success", data: [...] }
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const searchMovies = async (query, token) => {
  const response = await axiosInstance.get('/movies', {
    params: { search: query },
    headers: getAuthHeader(token),
  });
  return response.data.data || [];
};
