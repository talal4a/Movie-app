import axiosInstance from '@/api/axioInstance';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MovieCollection from './CollectionMovie';
const fetchGroupedMovies = async () => {
  const res = await axiosInstance.get('movies/grouped');
  return res.data;
};
export default function GroupedMovieCollections() {
  const {
    data: groupedMovies = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['grouped-movies'],
    queryFn: async () => {
      const res = await axiosInstance.get('movies/grouped');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const collectionNames = Object.keys(groupedMovies);

  if (isLoading) return <p>Loading collections...</p>;
  if (isError) return <p className="text-red-500">Error loading collections</p>;

  return (
    <div className="space-y-10">
      {collectionNames.map((name) => (
        <MovieCollection
          key={name}
          collectionName={name}
          initialMovies={groupedMovies[name]}
        />
      ))}
    </div>
  );
}
