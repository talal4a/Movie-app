import { Plus, Play, Check } from 'lucide-react';
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
  const [justAdded, setJustAdded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const toggleWatchlist = () => {
    if (isSaved) {
      dispatch(removeFromWatchlist(movie._id));
      setJustAdded(false);
    } else {
      dispatch(addToWatchlist(movie._id));
      setJustAdded(true);
      setButtonDisabled(true);
      setTimeout(() => {
        setJustAdded(false);
        setButtonDisabled(false);
      }, 2000);
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
          <div className="absolute right-2 top-1/2 -translate-y-1/2 mt-[90px]">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!buttonDisabled) toggleWatchlist();
                showToast({
                  message: 'Add to List  successfully',
                  type: 'success',
                });
              }}
              disabled={buttonDisabled}
              className={`rounded-full p-3 shadow-lg transition-all duration-300 ${
                isSaved || justAdded
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-white text-black hover:scale-110'
              }`}
              title={isSaved ? 'Already in Watchlist' : 'Add to Watchlist'}
            >
              <span
                className={`transition-all duration-300 ease-in-out ${
                  justAdded ? 'animate-ping-once' : ''
                }`}
              >
                {isSaved || justAdded ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="p-3 text-white space-y-1">
          <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-gray-400">{movie.releaseYear}</p>
          <p className="text-xs text-gray-400">{movie.runtime}</p>
          <div className="flex gap-1">
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className={`text-[10px] bg-gray-700 px-2 py-0.5 rounded-full
        ${index === 1 ? 'hidden md:inline' : ''}`}
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
        </div>
      </div>
    </Link>
  );
}
