import { useEffect, useRef, useState } from 'react';
import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../api/auth';
import Spinner from './Spinner';
import VideoPlayer from './VideoPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '@/slice/watchListSlice';
import { useToast } from '@/context/ToastContext';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: false });
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [previewStarted, setPreviewStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);
  const [autoShowTooltip, setAutoShowTooltip] = useState(false);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList.items);

  const { isLoading, data: movie } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    keepPreviousData: true,
    staleTime: 1000,
  });

  const isSaved =
    Array.isArray(watchlist) &&
    watchlist.some((item) => item && item._id === movie?._id);

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

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    if (inView && !hasPlayed && videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.warn('Autoplay failed:', e);
      });
      setHasPlayed(true);
      setPreviewStarted(true);
      setIsPaused(false);

      // Hide description immediately when video starts
      setShowDescription(false);

      // Auto show tooltip when preview starts
      setAutoShowTooltip(true);
      setTimeout(() => {
        setAutoShowTooltip(false);
      }, 3000); // Hide after 3 seconds
    } else if (!inView && videoRef.current && previewStarted && !videoEnded) {
      // Pause video when out of view and show backdrop
      videoRef.current.pause();
      setIsPaused(true);
      setPreviewStarted(false);
      setShowDescription(true);
      setAutoShowTooltip(false);
    } else if (
      inView &&
      hasPlayed &&
      videoRef.current &&
      isPaused &&
      !videoEnded
    ) {
      // Resume video when back in view
      videoRef.current.play().catch((e) => {
        console.warn('Resume failed:', e);
      });
      setIsPaused(false);
      setPreviewStarted(true);
      setShowDescription(false);

      // Auto show tooltip when resuming
      setAutoShowTooltip(true);
      setTimeout(() => {
        setAutoShowTooltip(false);
      }, 3000);
    }
  }, [inView, hasPlayed, previewStarted, videoEnded, isPaused]);

  if (isLoading || !movie) {
    return <Spinner />;
  }

  return (
    <section
      ref={ref}
      className="relative w-full h-screen text-white overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={movie.previewTrailer}
          className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
            videoEnded || isPaused || !previewStarted
              ? 'opacity-0 scale-105'
              : 'opacity-100 scale-100'
          }`}
          muted={isMuted}
          playsInline
          loop={false}
          preload="auto"
          poster={movie.backdrop}
          onEnded={() => {
            setVideoEnded(true);
            setPreviewStarted(false);
            setAutoShowTooltip(false);

            // Smooth transition to backdrop
            setTimeout(() => {
              setShowDescription(true);
            }, 500); // Increased delay for smoother transition
          }}
        />
        {(videoEnded || isPaused || !previewStarted) && (
          <>
            <img
              src={movie.backdrop}
              alt="Backdrop"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-out ${
                videoEnded || isPaused || !previewStarted
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-1000" />
          </>
        )}
      </div>

      {/* Volume Button - Top Right - Only visible during preview */}
      <div
        className={`absolute top-16 right-4 sm:top-20 sm:right-6 lg:top-24 lg:right-8 z-20 transition-all duration-500 ease-in-out ${
          previewStarted && !videoEnded
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative">
          {/* Netflix-style Tooltip */}
          <div
            className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm font-medium rounded shadow-lg whitespace-nowrap transition-all duration-300 ease-in-out ${
              showVolumeTooltip || autoShowTooltip
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-2 pointer-events-none'
            }`}
          >
            {isMuted ? 'Unmute this video' : 'Mute this video'}
            {/* Tooltip Arrow */}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>

          <button
            onClick={toggleMute}
            onMouseEnter={() => setShowVolumeTooltip(true)}
            onMouseLeave={() => setShowVolumeTooltip(false)}
            disabled={!previewStarted || videoEnded}
            className="bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black/80 transition z-10 disabled:opacity-50 border border-gray-600"
          >
            {isMuted ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 max-w-none">
        {/* Title - Responsive Typography */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-4 sm:mb-6 tracking-tight leading-[0.85] sm:leading-[0.9] max-w-4xl">
          <span className="block">{movie.title?.split(' ')[0]}</span>
          <span className="block">
            {movie.title?.split(' ').slice(1).join(' ')}
          </span>
        </h1>

        {/* Movie Info - Responsive Layout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-green-400 font-bold text-base sm:text-lg lg:text-xl">
              98% Match
            </span>
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-gray-300">{movie.releaseYear}</div>
          <div className="text-gray-300 hidden xs:block">{movie.runtime}</div>
          <div className="bg-gray-800 px-2 py-1 text-xs sm:text-sm rounded text-white flex items-center">
            {movie.ratings?.voteAverage?.toFixed(1)}
          </div>
        </div>

        {/* Description - Responsive Text with Animation */}
        <div
          className={`transition-all duration-1000 ease-in-out overflow-hidden ${
            showDescription
              ? 'max-h-32 opacity-100 transform translate-y-0'
              : 'max-h-0 opacity-0 transform -translate-y-4'
          }`}
        >
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-200 max-w-lg lg:max-w-xl xl:max-w-2xl mb-6 sm:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {movie.description}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handlePlay}
            className="bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg transform hover:scale-105 min-w-[100px]"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Play</span>
          </button>

          <button
            onClick={toggleWatchlist}
            disabled={buttonDisabled}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base flex items-center justify-center space-x-2 backdrop-blur-sm min-w-[100px] transition-all duration-200 ${
              isSaved || justAdded
                ? 'bg-gray-600 text-white cursor-not-allowed'
                : 'bg-gray-600 bg-opacity-80 text-white hover:bg-gray-500 transform hover:scale-105'
            }`}
          >
            {isSaved || justAdded ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>My List</span>
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {isPlaying && (
        <VideoPlayer
          embedUrl={movie.embedUrl}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </section>
  );
}
