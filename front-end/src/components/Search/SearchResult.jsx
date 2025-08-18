import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { ProgressiveImage } from '../ui/ProgressiveImage';
export default function SearchResult({ query, movies }) {
  if (movies.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-gray-400 mb-6">No movies found for "{query}"</p>
          <p className="text-gray-500 text-sm">
            Try searching for another movie, show, actor, director, or genre.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">
          Search Results for "<span className="text-red-500">{query}</span>"
        </h1>
        <p className="text-sm text-gray-400">
          {movies.length} {movies.length === 1 ? 'result' : 'results'} found
        </p>
      </div>
      <div className="space-y-4">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movie/${movie.slug}`}
            className="group flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-900/50 transition-colors duration-200 border-b border-gray-800 last:border-b-0 overflow-visible"
          >
            <div className="relative flex-shrink-0 w-full sm:w-64 h-36 md:h-40 rounded-lg overflow-hidden bg-gray-800">
              <div className="w-full h-full">
                {movie.poster ? (
                  <ProgressiveImage
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full"
                    loading="lazy"
                    priority="low"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Play className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                  <button className="bg-white text-black rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
                {movie.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {movie.duration}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors line-clamp-2">
                {movie.title}
              </h3>

              <div className="flex items-center mt-1 text-sm text-gray-400">
                <span>{movie.views || 'N/A'} views</span>
                <span className="mx-2">•</span>
                <span>
                  {movie.releaseYear
                    ? new Date(movie.releaseYear).getFullYear()
                    : 'N/A'}
                </span>
              </div>

              {movie.director && (
                <div className="mt-2 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                  <span className="ml-2 text-sm text-gray-400">
                    {movie.director}
                  </span>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                {movie.overview || 'No description available'}
              </p>

              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {movie.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre._id || genre}
                      className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-300"
                    >
                      {genre.name || genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
