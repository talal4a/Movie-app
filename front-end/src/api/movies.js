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
