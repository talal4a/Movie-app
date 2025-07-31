import axiosInstance from '@/api/axioInstance';
import React, { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import MovieCollection from './CollectionMovie';
const fetchGroupedMovies = async () => {
  const res = await axiosInstance.get('movies/grouped');
  return res.data;
};
export default function GroupedMovieCollectionsSuspense() {
  const { data: groupedMovies = {}, isLoading } = useSuspenseQuery({
    queryKey: ['grouped-movies'],
    queryFn: fetchGroupedMovies,
    staleTime: Infinity,
  });
  const collectionNames = Object.keys(groupedMovies);
  return (
    <div className="space-y-10">
      {collectionNames.map((name) => (
        <MovieCollection
          key={name}
          collectionName={name}
          initialMovies={groupedMovies}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
