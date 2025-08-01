import { useQuery, useQueryClient } from '@tanstack/react-query';
import MovieCard from './MovieCard';
import { getAllMovies } from '../api/movies';
import Spinner from './Spinner';
export default function MovieRow({ title }) {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['allMovies'],
    queryFn: getAllMovies,
  });
  const { data: movies, isLoading } = useQuery({
    queryKey: ['allMovies'],
    queryFn: getAllMovies,
    keepPreviousData: true,
    staleTime: 1000,
  });
  if (isLoading) return <Spinner />;
  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie, index) => (
          <MovieCard movie={movie} key={index} index={index}/>
        ))}
      </div>
    </section>
  );
}
