import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/context/ToastContext';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '@/redux/slice/watchListSlice';
import { ProgressiveImage } from './ProgressiveImage';
import { useState } from 'react';
const MovieCard = ({ movie, isContinueWatching = false, onRemove }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlistItems = useSelector((state) => state.watchList?.items || []);
  const [isLoading, setIsLoading] = useState(false);
  const isSaved = watchlistItems.some((item) => item._id === movie._id);
  const [isHovered, setIsHovered] = useState(false);
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
    if (isLoading) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && !isSaved) {
      handleAddToWatchlist(movie._id);
    }
  };

  return (
    <Link
      to={`/movie/${movie.slug || movie._id}`}
      className="block relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-lg w-45"
        whileHover={{ scale: 1.04, y: -6 }}
      >
        <div className="w-full max-w-xs aspect-[2/3] relative group cursor-pointer overflow-hidden rounded-lg bg-black">
          <ProgressiveImage
            src={src}
            alt={movie.title}
            className="w-full h-full object-contain"
            priority="high"
            loading="eager"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="bg-white p-3.5 rounded-full hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 text-black" fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
          <motion.button
            onClick={handleWatchlistClick}
            className={`${isLoading || isSaved ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-600/90'} bg-gray-700/90 p-2 md:p-2.5 rounded-full transition-all`}
            whileHover={(!isLoading && !isSaved) ? { scale: 1.1 } : {}}
            whileTap={(!isLoading && !isSaved) ? { scale: 0.9 } : {}}
            title={isSaved ? 'In your watchlist' : 'Add to watchlist'}
            disabled={isLoading || isSaved}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2} />
            ) : (
              <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2} />
            )}
          </motion.button>
        </div>
        {isContinueWatching && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className={`absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full transition-colors duration-200 z-10 hover:bg-red-600 hover:text-white`}
            aria-label="Remove from Continue Watching"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="p-3 text-white space-y-1">
          <div className="space-y-3">
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
        </div>
      </motion.div>
    </Link>
  );
};
export default MovieCard;
