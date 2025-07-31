import { Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '@/slice/watchListSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useLazyImage } from '@/hooks/useLazyImage';

export default function MovieCard({ movie, index }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const watchlist = useSelector((state) => state.watchList.items);
  const { imgRef, isVisible, src } = useLazyImage(movie.poster, index < 4);

  const isSaved =
    Array.isArray(watchlist) &&
    watchlist.some((item) => item && item._id === movie._id);

  const handleAddToWatchlist = (e) => {
    e.preventDefault();

    if (!isSaved) {
      dispatch(addToWatchlist(movie._id));
      showToast({ message: 'Added to Watchlist', type: 'success' });
    } else {
      // Optionally show a message
      showToast({ message: 'Already in Watchlist', type: 'info' });
    }
  };

  return (
    <Link to={`/movie/${movie._id}`} className="block">
      <div className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 w-45">
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
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className={`text-[10px] bg-gray-700 px-2 py-0.5 rounded-full ${
                  index === 1 ? 'hidden md:inline' : ''
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 text-xs font-medium">
              ⭐ {movie.tmdbRatings.average?.toFixed(1) || 'N/A'}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleAddToWatchlist}
              disabled={isSaved}
              title={isSaved ? 'Already in Watchlist' : 'Add to Watchlist'}
              className={`transition-all duration-300 ease-in-out 
    ${isSaved ? 'text-gray-500 opacity-60 cursor-not-allowed' : 'text-white hover:scale-110 hover:-translate-y-1'}`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-7 h-7" />
              ) : (
                <Bookmark className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
