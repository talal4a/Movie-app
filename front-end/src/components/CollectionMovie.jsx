import axiosInstance from '@/api/axioInstance';
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
export default function GroupedMovieCollections() {
  const [groupedMovies, setGroupedMovies] = useState({});
  useEffect(() => {
    const fetchGroupedMovies = async () => {
      try {
        const res = await axiosInstance.get('movies/grouped');
        setGroupedMovies(res.data);
      } catch (err) {
        console.error('Error fetching grouped movies:', err);
      }
    };
    fetchGroupedMovies();
  }, []);
  return (
    <div className="space-y-10 px-10">
      {Object.keys(groupedMovies).map((collectionName) => (
        <div key={collectionName}>
          <h2 className="text-2xl font-bold mb-4">{collectionName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {groupedMovies[collectionName].length > 0 ? (
              groupedMovies[collectionName].map((movie, index) => (
                <MovieCard movie={movie} index={index} />
              ))
            ) : (
              <p className="text-gray-400">No movies available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
