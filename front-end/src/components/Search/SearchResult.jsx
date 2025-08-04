import { Play, Info } from 'lucide-react';
import { useState } from 'react';
export default function SearchResult({ query, movies, onPlay }) {
  const [setImageErrors] = useState({});
  function handlePlay(movie) {
    if (onPlay) {
      onPlay(movie);
    } else {
      window.location.href = `/movie/${movie.slug}`;
    }
  }
  function handleImageError(movieId) {
    setImageErrors((prev) => ({ ...prev, [movieId]: true }));
  }
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-transparent px-4 pt-4 pb-6">
        <p className="text-gray-400 text-sm">
          {movies.length} {movies.length === 1 ? 'result' : 'results'} for "
          <span className="text-white font-medium">{query}</span>"
        </p>
      </div>
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-between px-8 mt-20">
          <p className="text-zinc-400 text-center mb-2">
            No results found for "{query}"
          </p>
          <p className="text-zinc-500 text-sm text-center">
            Try searching for another movie, show, actor, director, or genre.
          </p>
        </div>
      ) : (
        <div className="space-y-2 px-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="flex justify-between items-center py-3 border-b border-zinc-700 w-full hover:bg-zinc-800"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => handlePlay(movie)}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-20 h-28 object-cover rounded"
                    onError={() => handleImageError(movie._id)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium text-base line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  {movie.year && (
                    <p className="text-gray-400 text-sm">{movie.year}</p>
                  )}
                  {movie.rating && (
                    <p className="text-gray-400 text-sm">
                      Rating: {movie.rating}
                    </p>
                  )}
                  {movie.duration && (
                    <p className="text-gray-400 text-sm">{movie.duration}</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(movie);
                  }}
                  className="bg-white text-black px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-200 transition flex items-center space-x-1"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
