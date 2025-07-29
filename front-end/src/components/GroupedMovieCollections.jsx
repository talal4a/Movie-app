import axiosInstance from '@/api/axioInstance';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MovieCollection from './CollectionMovie';
export default function GroupedMovieCollections() {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['collection-names'],
    queryFn: async () => {
      const res = await axiosInstance.get('movies/grouped');
      return Object.keys(res.data);
    },
  });
  const {
    data: collectionNames = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['collection-names'],
    queryFn: async () => {
      const res = await axiosInstance.get('movies/grouped');
      return Object.keys(res.data);
    },
  });
  if (isLoading) return <p>Loading collections...</p>;
  if (isError) return <p className="text-red-500">Error loading collections</p>;
  return (
    <div className="space-y-10 px-10">
      {collectionNames.map((name) => (
        <MovieCollection key={name} collectionName={name} />
      ))}
    </div>
  );
}
