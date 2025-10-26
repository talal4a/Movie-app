import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromWatchlist,
  fetchWatchlist,
} from '@/redux/slice/watchListSlice';
import MovieCard from '@/components/ui/MovieCard';
import { useToast } from '@/context/ToastContext';

export default function WatchListPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchList.items || []);

  useEffect(() => {
    dispatch(fetchWatchlist());
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [dispatch]);

  const removeMovie = (id) => {
    dispatch(removeFromWatchlist(id));
  };

  return (
    <div 
      className="min-h-screen bg-black text-white p-6 pt-24"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <h1 
        className="text-3xl font-bold mb-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        Your Watchlist
      </h1>
      
      {watchlist.length === 0 ? (
        <p 
          className="text-gray-400"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease-out 0.1s',
          }}
        >
          Your watchlist is empty.
        </p>
      ) : (
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s',
          }}
        >
          {watchlist.map((movie, index) => (
            <div 
              key={movie._id} 
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.3s ease-out ${0.2 + index * 0.05}s, transform 0.3s ease-out ${0.2 + index * 0.05}s`,
              }}
            >
              <MovieCard movie={movie} disableLink={true} />
              <button
                onClick={() => {
                  removeMovie(movie._id);
                  showToast({
                    message: 'Removed from watchlist',
                    type: 'success',
                  });
                }}
                className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
