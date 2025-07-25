import { getMoviesByCollection } from '@/api/movies';
import { useQueries } from '@tanstack/react-query';
import MovieCard from './MovieCard';

export default function MultiCollectionMovies({ collectionNames }) {
  const results = useQueries({
    queries: collectionNames.map((name) => ({
      queryKey: ['collection-movies', name],
      queryFn: () => getMoviesByCollection(name),
      enabled: !!name,
    })),
  });

  // Create one list per collection with deduplication inside each
  const groupedMovies = collectionNames.map((name, idx) => {
    const result = results[idx];
    const movies = result.data || [];

    // Deduplicate within this collection by _id
    const uniqueMap = new Map();
    movies.forEach((movie) => {
      if (!uniqueMap.has(movie._id)) {
        uniqueMap.set(movie._id, movie);
      }
    });

    return {
      name,
      movies: Array.from(uniqueMap.values()),
      result,
    };
  });

  return (
    <div className="space-y-12">
      {groupedMovies.map(({ name, movies, result }) => {
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
            {movies.length === 0 ? (
              <p className="text-gray-400">No movies to show.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((movie, index) => (
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
