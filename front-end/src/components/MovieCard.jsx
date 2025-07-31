// Your existing MovieCard with Redux watchlist integration
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/context/ToastContext';
import { addToWatchlist, removeFromWatchlist } from '@/slice/watchListSlice';


const MovieCard = ({ movie, index }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  // Get watchlist status from Redux store with correct key name
  const watchlistItems = useSelector((state) => state.watchList?.items || []);
  const isSaved = watchlistItems.some((item) => item._id === movie._id);

  const src = movie.poster || movie.backdrop || '/fallback.jpg';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  const handleAddToWatchlist = async (movieId) => {
    try {
      if (isSaved) {
        await dispatch(removeFromWatchlist(movieId));
        showToast({
          message: 'Movie removed from watchlist',
          type: 'success',
        });
      } else {
        await dispatch(addToWatchlist(movieId));
        showToast({
          message: 'Movie added to watchlist',
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: 'Something went wrong',
        type: 'error',
      });
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
          <img
            ref={imgRef}
            src={src}
            loading={index < 4 ? 'eager' : 'lazy'}
            alt={movie.title}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
              isLoaded ? 'blur-0 scale-100' : 'blur-md scale-105'
            } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
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

            <button
              onClick={handleWatchlistClick}
              title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-1.5 rounded-full transition-all duration-300 ease-in-out z-10 relative ${
                isSaved
                  ? 'text-blue-400 bg-blue-400/15 hover:bg-blue-400/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110'
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
