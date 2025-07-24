import { useQueries } from '@tanstack/react-query';
import { getMoviesByCollection } from '@/api/movies';
import MovieCard from './MovieCard';
export default function MultiCollectionMovies({ collectionNames }) {
  const results = useQueries({
    queries: collectionNames.map((name) => ({
      queryKey: ['collection-movies', name],
      queryFn: () => getMoviesByCollection(name),
      enabled: !!name,
    })),
  });
  const allMoviesWithCollection = results.flatMap((result, i) =>
    result.isSuccess
      ? result.data.map((movie) => ({
          ...movie,
          fromCollection: collectionNames[i],
        }))
      : []
  );
  const movieMap = new Map();
  allMoviesWithCollection.forEach((movie) => {
    if (!movieMap.has(movie._id)) {
      movieMap.set(movie._id, {
        ...movie,
        collections: [movie.fromCollection],
      });
    } else {
      movieMap.get(movie._id).collections.push(movie.fromCollection);
    }
  });

  const uniqueMovies = Array.from(movieMap.values());

  const groupedMovies = collectionNames.map((name) => ({
    name,
    movies: uniqueMovies.filter((movie) => movie.collections.includes(name)),
  }));

  return (
    <div className="space-y-12">
      {results.map((result, idx) => {
        const { name, movies: collectionMovies } = groupedMovies[idx];

        if (result.isLoading) {
          return (
            <section key={name} className="py-10">
              <h2 className="text-xl font-bold text-white mb-4">{name}</h2>
              <p className="text-gray-400">Loading...</p>
            </section>
          );
        }
        if (result.isError) {
          return (
            <section key={name} className="py-10">
              <h2 className="text-xl font-bold text-white mb-4">{name}</h2>
              <p className="text-red-400">Error loading movies.</p>
            </section>
          );
        }
        return (
          <section key={name} className="py-10">
            <h2 className="text-xl font-bold text-white mb-4">{name}</h2>
            {collectionMovies.length === 0 ? (
              <p className="text-gray-400">No unique movies to show.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {collectionMovies.map((movie, index) => (
                  <MovieCard
                    key={`${movie._id}-${name}`}
                    movie={movie}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
