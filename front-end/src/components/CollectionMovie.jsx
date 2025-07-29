import axiosInstance from '@/api/axioInstance';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MovieCard from './MovieCard';
export default function MovieCollection({ collectionName }) {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['movies-collection', collectionName],
    queryFn: async () => {
      const res = await axiosInstance.get('movies/grouped');
      return res.data[collectionName] || [];
    },
  });
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movies-collection', collectionName],
    queryFn: async () => {
      const res = await axiosInstance.get('movies/grouped');
      return res.data[collectionName] || [];
    },
  });
  if (isLoading) return <p>Loading {collectionName}...</p>;
  if (isError)
    return <p className="text-red-500">Error loading {collectionName}</p>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{collectionName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieCard key={movie.id || index} movie={movie} index={index} />
          ))
        ) : (
          <p className="text-gray-400">No movies available</p>
        )}
      </div>
    </div>
  );
}
