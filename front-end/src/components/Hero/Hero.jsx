import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMovies } from '@/api/movies';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '@/redux/slice/watchListSlice';
import { useToast } from '@/context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { markAsWatched } from '@/api/continueWatching';
import {
  Play,
  Plus,
  Check,
  Info,
  Volume2,
  VolumeX,
  ChevronDown,
} from 'lucide-react';
import Spinner from '../ui/Spinner';

const Hero = ({ movie: movieProp }) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList.items);

  // State management - declare all hooks first
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [fadeContent, setFadeContent] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const videoRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  // Fetch movies if no movie prop is provided
  const { isLoading, data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    enabled: !movieProp,
    keepPreviousData: true,
    staleTime: 1000,
  });

  // Get the current movie (from props or fetched)
  const movie = movieProp || (Array.isArray(movies) ? movies[0] : movies);

  // Mark movie as watched mutation
  const { mutate } = useMutation({
    mutationFn: (id) => markAsWatched(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['continue-Watching']);
      navigate(`/movie/${movie?._id}`);
    },
  });

  // Calculate match percentage
  const getConsistentMatch = useCallback((movie) => {
    if (!movie?._id) return 85;
    let hash = 0;
    for (let i = 0; i < movie._id.length; i++) {
      hash = (hash << 5) - hash + movie._id.charCodeAt(i);
      hash = hash & hash;
    }
    if (movie.title) {
      for (let i = 0; i < movie.title.length; i++) {
        hash += movie.title.charCodeAt(i);
      }
    }
    if (movie.releaseYear) {
      hash += movie.releaseYear;
    }
    return 70 + (Math.abs(hash) % 30);
  }, []);

  // Check if movie is in watchlist
  const isSaved = useMemo(() => {
    return (
      movie?._id &&
      Array.isArray(watchlist) &&
      watchlist.some((item) => item && item._id === movie._id)
    );
  }, [watchlist, movie?._id]);

  const matchPercentage =
    movie?.matchPercentage || movie?.match || getConsistentMatch(movie);

  // Auto-play video after delay (Netflix behavior)
  useEffect(() => {
    if (!movie?.trailerUrl) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
      setFadeContent(true);
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [movie?.trailerUrl]);

  // Handle play button click
  const handlePlay = useCallback(() => {
    if (!movie?._id) {
      showToast('No movie selected');
      return;
    }
    mutate(movie._id);
  }, [movie, mutate, showToast]);

  // Handle add to watchlist
  const handleAddToWatchlist = useCallback(() => {
    if (!movie?._id) return;

    if (isSaved) {
      dispatch(removeFromWatchlist(movie._id));
      showToast('Removed from My List');
    } else {
      dispatch(addToWatchlist(movie));
      showToast('Added to My List');
      setJustAdded(true);
      setButtonDisabled(true);

      // Re-enable the button after animation
      setTimeout(() => setButtonDisabled(false), 3000);

      // Reset the justAdded state after animation
      setTimeout(() => setJustAdded(false), 3000);
    }
  }, [movie, isSaved, dispatch, showToast]);

  // Handle toggle mute
  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleMoreInfo = useCallback(() => {
    if (!movie?._id) return;
    navigate(`/movie/${movie._id}`);
  }, [movie?._id, navigate]);

  const handleVideoEnd = useCallback(() => {
    setShowVideo(false);
    setFadeContent(false);
    setIsPlaying(false);

    setTimeout(() => {
      setShowVideo(true);
      setFadeContent(true);
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }, 2000);
  }, []);

  if (isLoading && !movieProp) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black">
        <Spinner />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const fullTitle = movie?.title || 'Loading...';
  const [mainTitle, ...rest] = fullTitle?.split(':') || [''];
  const subtitle = rest.length > 0 ? rest.join(':').trim() : '';

  const genres =
    movie?.genres || movie?.genre?.split(',').map((g) => g.trim()) || [];

  const releaseYear =
    movie?.releaseYear ||
    (movie?.release_date ? new Date(movie.release_date).getFullYear() : null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${movie.backdropPath || movie.posterPath})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>

        {movie.trailerUrl && showVideo && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={movie.trailerUrl}
              autoPlay
              muted={isMuted}
              loop
              onEnded={handleVideoEnd}
              playsInline
              preload="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40" />
          </div>
        )}
      </div>

      <div className="relative h-full flex flex-col justify-center">
        <div
          className={`px-12 lg:px-16 transition-all duration-700 ${fadeContent ? 'opacity-70' : 'opacity-100'}`}
        >
          <div className="max-w-2xl space-y-4">
            {movie?.seasons && (
              <div className="flex items-center space-x-3">
                <span className="text-red-600 font-bold text-lg tracking-widest">
                  NETFLIX
                </span>
                <span className="text-gray-400 text-sm tracking-[0.3em] font-light">
                  SERIES
                </span>
              </div>
            )}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
                {mainTitle}
              </h1>
              {subtitle && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white/90 mt-2 drop-shadow-xl">
                  {subtitle}
                </h2>
              )}
            </div>

            {/* Tagline if exists */}
            {movie.tagline && (
              <p className="text-lg md:text-xl text-gray-300 italic">
                {movie.tagline}
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex items-center space-x-4 text-white/90">
              <span className="text-green-400 font-semibold text-lg">
                {matchPercentage}% Match
              </span>
              {releaseYear && <span className="text-base">{releaseYear}</span>}
              {movie.seasons && (
                <span className="text-base">
                  {movie.seasons} Season{movie.seasons > 1 ? 's' : ''}
                </span>
              )}
              {movie.maturityRating && (
                <span className="px-2 py-0.5 border border-white/60 text-sm">
                  {movie.maturityRating}
                </span>
              )}
              {movie.duration && (
                <span className="text-base">{movie.duration}</span>
              )}
              {movie.vote_average && (
                <span className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex items-center space-x-2 text-white/80">
                {genres.map((genre, index) => (
                  <React.Fragment key={genre}>
                    <span>{genre}</span>
                    {index < genres.length - 1 && (
                      <span className="text-white/40">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed line-clamp-4">
              {movie.overview ||
                movie.description ||
                'No description available'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Play Button */}
              <button
                onClick={handlePlay}
                className="group flex items-center px-6 py-2.5 bg-white hover:bg-white/80 text-black font-semibold rounded transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                <span className="text-lg">Play</span>
              </button>

              {/* More Info Button */}
              <button
                onClick={handleMoreInfo}
                className="group flex items-center px-6 py-2.5 bg-gray-500/30 hover:bg-gray-500/20 text-white font-semibold rounded backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
              >
                <Info className="w-5 h-5 mr-2" />
                <span className="text-lg">More Info</span>
              </button>

              {/* Add to List Button */}
              <button
                onClick={handleAddToWatchlist}
                disabled={buttonDisabled}
                className="group flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 hover:border-white bg-gray-500/30 hover:bg-gray-500/20 backdrop-blur-sm transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isSaved ? 'Remove from My List' : 'Add to My List'}
              >
                {isSaved ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </button>
              {justAdded && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded animate-pulse">
                  Added to My List
                </span>
              )}
              {isPlaying && movie.trailerUrl && (
                <button
                  onClick={handleToggleMute}
                  className="group flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 hover:border-white bg-gray-500/30 hover:bg-gray-500/20 backdrop-blur-sm transition-all duration-200 transform hover:scale-110 ml-auto"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPlaying && movie.maturityRating && (
        <div className="absolute right-0 bottom-20 bg-black/50 backdrop-blur-sm border-l-3 border-white px-4 py-6 flex items-center">
          <span className="text-white text-xl font-bold">
            {movie.maturityRating}
          </span>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;
