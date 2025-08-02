import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromWatchlist,
  fetchWatchlist,
} from '@/redux/slice/watchListSlice';
import MovieCard from '@/components/MovieCard';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';
export default function WatchListPage() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchList.items || []);
  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);
  const removeMovie = (id) => {
    dispatch(removeFromWatchlist(id));
  };
  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <div key={movie._id} className="relative">
              <MovieCard movie={movie} disableLink={true} />
              <button
                onClick={() => {
                  removeMovie(movie._id);
                  showToast({
                    message: 'Remove to List  successfully',
                    type: 'success',
                  });
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
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
