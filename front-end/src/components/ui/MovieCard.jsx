import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/context/ToastContext';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '@/redux/slice/watchListSlice';
import { ProgressiveImage } from './ProgressiveImage';
const MovieCard = ({ movie, isContinueWatching = false, onRemove }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlistItems = useSelector((state) => state.watchList?.items || []);
  const isSaved = watchlistItems.some((item) => item._id === movie._id);
  const getOptimizedUrl = (url) => {
    if (!url) return '/fallback.jpg';
    if (url.includes('image.tmdb.org')) {
      const width = window.innerWidth;
      if (width < 640) return url.replace('/original/', '/w185/');
      if (width < 1024) return url.replace('/original/', '/w342/');
      return url.replace('/original/', '/w500/');
    }
    return url;
  };

  const src = getOptimizedUrl(movie.poster || movie.backdrop);

  const handleAddToWatchlist = async (movieId) => {
    try {
      if (isSaved) {
        await dispatch(removeFromWatchlist(movieId));
        showToast({ message: 'Movie removed from watchlist', type: 'success' });
      } else {
        await dispatch(addToWatchlist(movieId));
        showToast({ message: 'Movie added to watchlist', type: 'success' });
      }
    } catch (error) {
      showToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToWatchlist(movie._id);
  };

  return (
    <Link to={`/movie/${movie._id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.04, y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-lg w-45"
      >
        <div className="w-full h-60 overflow-hidden relative">
          <div className="w-full h-auto flex items-center justify-center">
            <ProgressiveImage
              src={src}
              alt={movie.title}
              className="max-w-full max-h-full object-contain"
              priority="high"
              loading="eager"
            />
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-black rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>

        {!isContinueWatching && (
          <button
            onClick={handleWatchlistClick}
            className={`absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full transition-colors duration-200 z-10 hover:bg-gray-600 hover:text-white ${
              isSaved ? 'text-blue-400 cursor-not-allowed' : 'text-white'
            }`}
            aria-label={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}

        {isContinueWatching && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors duration-200 z-10"
            aria-label="Remove from Continue Watching"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-3 text-white space-y-1">
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
        </div>
      </motion.div>
    </Link>
  );
};
export default MovieCard;
