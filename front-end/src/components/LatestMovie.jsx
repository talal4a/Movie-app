import { useQuery } from '@tanstack/react-query';
import { fetchLatestMovies } from '../api/auth';
import MovieCard from './MovieCard';
import Spinner from './Spinner';
export default function LatestMovies() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['latestMovies'],
    queryFn: fetchLatestMovies,
    keepPreviousData: true,
    staleTime: 1000,
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Latest Free Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies?.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
