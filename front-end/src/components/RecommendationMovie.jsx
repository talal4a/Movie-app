import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMoviesByGenre } from '../api/auth';
import MovieCard from './MovieCard';
import Spinner from './Spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function RecommendedMovies({ genre, id: currentMovieId }) {
  const [chunkIndex, setChunkIndex] = useState(0);
  const genreList = Array.isArray(genre) ? genre : [genre];
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['recommended', genreList],
    queryFn: async () => {
      const all = await Promise.all(genreList.map(fetchMoviesByGenre));
      const allMovies = all.flat();
      const uniqueMovies = allMovies.filter(
        (movie, index, self) =>
          self.findIndex((m) => m._id === movie._id) === index
      );
      return uniqueMovies;
    },
    staleTime: 1000 * 60 * 10,
  });
  const filteredMovies = movies.filter((movie) => movie._id !== currentMovieId);
  const chunkSize = 5;
  const totalChunks = Math.ceil(filteredMovies.length / chunkSize);

  const handlePrev = () => setChunkIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setChunkIndex((prev) => Math.min(prev + 1, totalChunks - 1));

  const chunkedMovies = filteredMovies.slice(
    chunkIndex * chunkSize,
    chunkIndex * chunkSize + chunkSize
  );
  if (isLoading) return <Spinner />;
  if (!filteredMovies.length) return null;
  return (
    <section className="mt-12 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Recommended Movies in Collection
      </h2>
      {filteredMovies.length > chunkSize ? (
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 disabled:opacity-40"
            onClick={handlePrev}
            disabled={chunkIndex === 0}
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 disabled:opacity-40"
            onClick={handleNext}
            disabled={chunkIndex === totalChunks - 1}
          >
            <ChevronRight />
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-white">
            Recommended Movies in Collection
          </h2>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {chunkedMovies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
