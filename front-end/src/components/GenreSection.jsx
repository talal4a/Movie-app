import { useQuery } from '@tanstack/react-query';
import { fetchMoviesByGenre } from '../api/movies';
import MovieCard from './MovieCard';
import Spinner from './Spinner';
export default function GenreSection({ genre }) {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['genre', genre],
    queryFn: () => fetchMoviesByGenre(genre),
    staleTime: 1000,
  });
  if (isLoading) return <Spinner />;
  if (!movies.length) return null;
  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{genre}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie,index) => (
          <MovieCard key={movie._id} movie={movie} index={index} />
        ))}
      </div>
    </section>
  );
}
