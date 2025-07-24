import { getMoviesByCollection } from '@/api/movies';
import { useQuery } from '@tanstack/react-query';
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
    <div>
      <h2>{collectionName} Movies</h2>
      {movies.length === 0 ? (
        <p>No movies found in this collection.</p>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.poster} alt={movie.title} />
              <h4>{movie.title}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CollectionMovies;
