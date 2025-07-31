import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { useRef, useState } from 'react';
const MovieCard = ({ movie, handleAddToWatchlist, isSaved }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  const src = movie.poster || movie.backdrop || '/fallback.jpg';
  return (
    <Link to={`/movie/${movie._id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.04, y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-lg w-45"
      >
        <div className="w-full h-60 overflow-hidden relative">
          <img
            ref={imgRef}
            src={src}
            loading="auto"
            alt={movie.title}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
              isLoaded ? 'blur-0 scale-100' : 'blur-md scale-105'
            } opacity-100`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-black rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
        <div className="p-3 text-white space-y-1 relative">
          <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-gray-400">{movie.releaseYear}</p>
          <p className="text-xs text-gray-400">{movie.runtime}</p>
          <div className="flex gap-1">
            {movie.genres?.slice(0, 2).map((genre, i) => (
              <span
                key={i}
                className={`text-[10px] bg-gray-700 px-2 py-0.5 rounded-full ${
                  i === 1 ? 'hidden md:inline' : ''
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 text-xs font-medium">
              ⭐ {movie.tmdbRatings?.average?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToWatchlist(movie._id);
              }}
              disabled={isSaved}
              title={isSaved ? 'Already in Watchlist' : 'Add to Watchlist'}
              className={`transition-all duration-300 ease-in-out ${
                isSaved
                  ? 'text-gray-500 opacity-60 cursor-not-allowed'
                  : 'text-white hover:scale-110 hover:-translate-y-1'
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-7 h-7" />
              ) : (
                <Bookmark className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
