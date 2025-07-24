import { getMoviesByCollection } from '@/api/movies';
import { useQuery } from '@tanstack/react-query';
import MovieCard from './MovieCard';
const CollectionMovies = ({ collectionName }) => {
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['collection-movies', collectionName],
    queryFn: () => getMoviesByCollection(collectionName),
    enabled: !!collectionName,
  });
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load movies.</p>;
  return (
    <section className="py-12 ">
      <h2 className="text-2xl font-semibold text-white mb-4">
        {collectionName}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie, index) => (
          <MovieCard key={movie._id} movie={movie} index={index} />
        ))}
      </div>
    </section>
  );
};
export default CollectionMovies;
