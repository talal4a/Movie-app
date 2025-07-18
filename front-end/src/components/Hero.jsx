import { useState } from 'react';
import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../api/auth';
import Spinner from './Spinner';
import VideoPlayer from './VideoPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '@/slice/watchListSlice';
import { useToast } from '@/context/ToastContext';
export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList.items);
  const { isLoading, data: movie } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    keepPreviousData: true,
    staleTime: 1000,
  });
  const isSaved = Array.isArray(watchlist) && watchlist.some((item) => item && item._id === movie?._id);
  const handlePlay = () => setIsPlaying(true);
  const toggleWatchlist = () => {
    if (!movie) return;
    if (isSaved) {
      dispatch(removeFromWatchlist(movie._id));
      showToast({ message: 'Removed from List', type: 'success' });
    } else {
      dispatch(addToWatchlist(movie._id));
      setJustAdded(true);
      setButtonDisabled(true);
      showToast({ message: 'Added to List successfully', type: 'success' });
      setTimeout(() => {
        setJustAdded(false);
        setButtonDisabled(false);
      }, 2000);
    }
  };
  if (isLoading || !movie) {
    return <Spinner />;
  }
  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[3000ms] ease-out"
          style={{
            objectPosition: 'center top',
            minHeight: '100vh',
            minWidth: '100vw',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-16 max-w-7xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 tracking-tight leading-[0.9] max-w-4xl">
          <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent animate-pulse">
            {movie.title?.split(' ')[0]}
          </span>
          <br />
          <span className="text-white">
            {movie.title?.split(' ').slice(1).join(' ')}
          </span>
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold text-lg sm:text-xl">
              98% Match
            </span>
            <ThumbsUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-gray-300">{movie.releaseYear}</div>
          <div className="text-gray-300">{movie.runtime}</div>
          <div className="bg-gray-800 px-2 py-1 text-sm rounded text-white flex items-center">
            {movie.ratings?.voteAverage?.toFixed(1)}
          </div>
        </div>
        <p className="text-lg lg:text-xl text-gray-200 max-w-3xl mb-8 leading-relaxed">
          {movie.description}
        </p>
        <div className="flex gap-4 mb-8 flex-nowrap sm:flex-wrap">
          <button
            onClick={handlePlay}
            className="bg-white text-black font-bold px-8 py-3 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 text-lg shadow-lg transform hover:scale-105 w-[140px]"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Play</span>
          </button>
          <button
            onClick={toggleWatchlist}
            disabled={buttonDisabled}
            className={`px-8 py-3 rounded-md text-lg flex items-center space-x-2 backdrop-blur-sm w-[160px] transition-all duration-200 ${
              isSaved || justAdded
                ? 'bg-gray-600 text-white cursor-not-allowed'
                : 'bg-gray-600 bg-opacity-80 text-white hover:bg-gray-500'
            }`}
          >
            {isSaved || justAdded ? (
              <Check className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
            
            <span>My List</span>
          </button>
        </div>
      </div>
      {isPlaying && (
        <VideoPlayer
          embedUrl={movie.embedUrl}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </section>
  );
}
