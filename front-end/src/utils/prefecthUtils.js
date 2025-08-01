import axiosInstance from '@/api/axioInstance';
import { fetchMovies } from '@/api/movies';

export const fetchGroupedMovies = async () => {
  const res = await axiosInstance.get('movies/grouped');
  return res.data;
};
export const prefetchGroupedMovies = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: ['grouped-movies'],
    queryFn: fetchGroupedMovies,
    staleTime: 10 * 60 * 1000,
  });
};
export const prefetchHeroMovie = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 10 * 60 * 1000,
  });
};
export const prefetchMovieDetail = (queryClient, movieId) => {
  return queryClient.prefetchQuery({
    queryKey: ['movie', movieId],
    queryFn: () =>
      axiosInstance.get(`/movies/${movieId}`).then((res) => res.data),
    staleTime: 10 * 60 * 1000,
  });
};
export const prefetchWatchlist = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: ['watchlist'],
    queryFn: () => axiosInstance.get('/watchlist').then((res) => res.data),
    staleTime: 0,
  });
};
