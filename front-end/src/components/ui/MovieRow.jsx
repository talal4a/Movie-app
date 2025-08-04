import { useQuery } from '@tanstack/react-query';
import MovieCard from './MovieCard';
import { getAllMovies } from '../../api/movies';
import Spinner from './Spinner';
export default function MovieRow({ title, items, isContinueWatching = false, onRemove }) {
  const shouldFetch = !items;
  const { data: fetchedMovies, isLoading } = useQuery({
    queryKey: ['allMovies'],
    queryFn: getAllMovies,
    enabled: shouldFetch,
    keepPreviousData: true,
    staleTime: 1000,
  });
  const finalItems = shouldFetch ? fetchedMovies : items;
  const movies = isContinueWatching ? finalItems.map(item => item.movie) : finalItems;
  if (!finalItems || isLoading) return <Spinner />;
  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie, index) => (
          <MovieCard 
            movie={movie} 
            key={index} 
            index={index}
            isContinueWatching={isContinueWatching}
            onRemove={isContinueWatching ? () => onRemove(finalItems[index]._id) : null}
          />
        ))}
      </div>
    </section>
  );
}
