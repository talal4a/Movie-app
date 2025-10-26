import MovieCard from '../ui/MovieCard';
import Spinner from '../ui/Spinner';
export default function MovieCollection({
  collectionName,
  initialMovies: data,
  isLoading,
}) {
  const movies = data?.[collectionName.trim()] || [];
  if (isLoading) {
    return <Spinner />;
  }
  if (!movies.length) {
    return (
      <p className="text-gray-500 italic">
        No movies found in {collectionName}
      </p>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{collectionName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id || index} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
}
