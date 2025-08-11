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
import { useNavigate } from 'react-router-dom';
import { markAsWatched } from '@/api/continueWatching';
import { Play, Plus, Check, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../ui/Spinner';
import VideoPlayer from '../ui/VideoPlayer';
const getPlayedPreviews = () => {
  try {
    const stored = sessionStorage.getItem('playedPreviews');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (e) {
    return new Set();
  }
};
const savePlayedPreviews = (previews) => {
  try {
    sessionStorage.setItem('playedPreviews', JSON.stringify([...previews]));
  } catch (e) {
    console.error('Failed to save played previews:', e);
  }
};
const playedPreviews = getPlayedPreviews();
const Hero = ({ movie: movieProp }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList.items);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [fadeContent, setFadeContent] = useState(false);
  const [hideDescription, setHideDescription] = useState(false);
  const [showSoundPopup, setShowSoundPopup] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);

  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const initialPlayTimeoutRef = useRef(null);
  const hasPlayedRef = useRef(false);

  const { isLoading, data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    enabled: !movieProp,
    keepPreviousData: true,
    staleTime: 1000,
  });
  const movie = movieProp || (Array.isArray(movies) ? movies[0] : movies);

  useEffect(() => {
    if (movie?._id && playedPreviews.has(movie._id)) {
      hasPlayedRef.current = true;

      setHideDescription(false);
    } else {
      hasPlayedRef.current = false;
      setHideDescription(false);
    }
  }, [movie?._id]);

  const { mutate } = useMutation({
    mutationFn: (id) => markAsWatched(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['continue-Watching']);
    },
  });
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

  const isSaved = useMemo(() => {
    return (
      movie?._id &&
      Array.isArray(watchlist) &&
      watchlist.some((item) => item && item._id === movie._id)
    );
  }, [watchlist, movie?._id]);

  const matchPercentage =
    movie?.matchPercentage || movie?.match || getConsistentMatch(movie);

  const handleVideoLoadedData = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (movie?._id) {
      playedPreviews.add(movie._id);
      hasPlayedRef.current = true;
      savePlayedPreviews(playedPreviews);
    }
    setShowVideo(false);
    setIsPlaying(false);
    setFadeContent(false);
    setHideDescription(false);
  }, [movie?._id]);
  const startVideoPlayback = useCallback(() => {
    if (!videoRef.current || isPlaying) return;
    setFadeContent(false);
    setHideDescription(false);
    setTimeout(() => {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setFadeContent(true);

            setShowSoundPopup(true);
            setTimeout(() => {
              setShowSoundPopup(false);
            }, 4000);
            setTimeout(() => {
              setHideDescription(true);
            }, 3000);
          })
          .catch((error) => {
            console.error('Playback error:', error);
            handleVideoEnded();
          });
      }
    }, 50);
  }, [isPlaying, handleVideoEnded]);
  const startVideoTransition = useCallback(() => {
    if (!videoRef.current || !movie?.previewTrailer) {
      return;
    }
    if (hasPlayedRef.current) {
      return;
    }
    if (isPlaying || showVideo) {
      return;
    }
    setShowVideo(true);
    setFadeContent(false);
    setHideDescription(false);

    if (videoLoaded) {
      startVideoPlayback();
    }
  }, [
    videoLoaded,
    movie?.previewTrailer,
    isPlaying,
    showVideo,
    startVideoPlayback,
  ]);
  useEffect(() => {
    if (!heroRef.current || !movie?.previewTrailer) return;
    if (hasPlayedRef.current) return;
    let hasInitiallyStarted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !document.hidden) {
            if (!hasPlayedRef.current && !hasInitiallyStarted && !showVideo) {
              initialPlayTimeoutRef.current = setTimeout(() => {
                startVideoTransition();
                hasInitiallyStarted = true;
              }, 1500);
            } else if (
              videoRef.current &&
              videoRef.current.paused &&
              showVideo &&
              !hasPlayedRef.current
            ) {
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);

                  setFadeContent(true);

                  setShowSoundPopup(true);
                  setTimeout(() => {
                    setShowSoundPopup(false);
                  }, 3000);
                  setTimeout(() => {
                    setHideDescription(true);
                  }, 1000);
                })
                .catch(console.error);
            }
          } else if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
            setFadeContent(false);
            setHideDescription(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
        setFadeContent(false);
        setHideDescription(false);
      } else if (
        !document.hidden &&
        videoRef.current &&
        videoRef.current.paused &&
        showVideo &&
        !hasPlayedRef.current
      ) {
        const rect = heroRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setFadeContent(true);
              setShowSoundPopup(true);
              setTimeout(() => {
                setShowSoundPopup(false);
              }, 3000);
              setTimeout(() => {
                setHideDescription(true);
              }, 1000);
            })
            .catch(console.error);
        }
      }
    };

    observer.observe(heroRef.current);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
      if (initialPlayTimeoutRef.current) {
        clearTimeout(initialPlayTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [movie?.previewTrailer, startVideoTransition, videoLoaded, showVideo]);

  const handlePlay = useCallback(() => {
    if (!movie?._id) {
      showToast({ message: 'No movie selected', type: 'error' });
      return;
    }
    

    mutate(movie._id);
    setShowFullMovie(true);
  }, [movie, mutate, showToast, navigate]);

  const handleAddToWatchlist = useCallback(async () => {
    if (!movie?._id || isAddingToList) return;
    
    setIsAddingToList(true);
    try {
      if (isSaved) {
        await dispatch(removeFromWatchlist(movie._id));
        showToast({ message: 'Removed from My List', type: 'success' });
      } else {
        await dispatch(addToWatchlist(movie._id));
        showToast({ message: 'Added to My List', type: 'success' });
      }
    } catch (error) {
      showToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsAddingToList(false);
    }
  }, [movie, isSaved, dispatch, showToast, isAddingToList]);
  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowSoundPopup(false);
    }
  }, [isMuted]);
  const handleVideoEnd = useCallback(() => {
    if (movie?._id) {
      playedPreviews.add(movie._id);
      hasPlayedRef.current = true;
      savePlayedPreviews(playedPreviews);
    }
    setIsPlaying(false);
    setTimeout(() => {
      setHideDescription(false);
    }, 200);
    setTimeout(() => {
      setFadeContent(false);
    }, 500);
    setTimeout(() => {
      setShowVideo(false);
      setVideoLoaded(false);
    }, 1200);
  }, [movie?._id]);
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
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url(${movie.backdrop || movie.posterPath})`,
            transform: showVideo ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>
        {movie.previewTrailer && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              showVideo ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              visibility: showVideo ? 'visible' : 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: showVideo ? 'block' : 'none'
            }}>
              <video
                ref={videoRef}
                key={`video-${movie._id}-${showVideo}`}
                className="w-full h-full object-cover"
                src={movie.previewTrailer}
                muted={true}
                onEnded={handleVideoEnd}
                onLoadedData={handleVideoLoadedData}
                onCanPlay={() => {
                  handleVideoLoadedData();
                  console.log('Video can play');
                  console.log('Video duration:', videoRef.current?.duration);
                }}
                onPlay={() => {
                  setIsPlaying(true);
                  setFadeContent(true);
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setFadeContent(false);
                }}
                onError={(e) => {
                  console.error('Video error event fired');
                  console.error('Video error details:', e.target.error);
                  console.error('Video network state:', e.target.networkState);
                  console.error('Video ready state:', e.target.readyState);
                  // Fallback to navigating to the movie page on error
                  mutate(movie._id);
                }}
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isPlaying ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40" />
          </div>
        )}
      </div>
      <div className="relative h-full flex flex-col justify-center">
        <div
          className={`px-12 lg:px-16 transition-all duration-1000 ease-out ${
            fadeContent
              ? 'opacity-70 transform translate-x-2'
              : 'opacity-100 transform translate-x-0'
          }`}
        >
          <div className="max-w-2xl space-y-4">
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
            {movie.tagline && (
              <p className="text-lg md:text-xl text-gray-300 italic">
                {movie.tagline}
              </p>
            )}
            <div className="flex items-center space-x-4 text-white/90">
              <span className="text-green-400 font-semibold text-lg">
                {matchPercentage}% Match
              </span>
              {releaseYear && <span className="text-base">{releaseYear}</span>}
            </div>
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
            <div className="relative">
              <div
                style={{
                  opacity: hideDescription ? 0 : 1,
                  maxHeight: hideDescription ? '0px' : '200px',
                  overflow: 'hidden',
                  transition: 'opacity 0.5s ease-out, max-height 0.5s ease-out',
                  marginBottom: hideDescription ? '0' : '16px',
                }}
              >
                <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed line-clamp-4">
                  {movie.description || 'No description available'}
                </p>
              </div>
              <div
                className={`flex items-center space-x-3 transition-all duration-500 ease-out ${hideDescription ? 'mt-0' : 'mt-4'}`}
              >
                <button
                  onClick={handlePlay}
                  className="group flex items-center px-6 py-2.5 bg-white hover:bg-white/80 text-black font-semibold rounded transition-all duration-200 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  <span className="text-lg">Play</span>
                </button>
                <button
                  onClick={handleAddToWatchlist}
                  disabled={isAddingToList || isSaved}
                  className={`group flex items-center px-6 py-2.5 ${
                    isAddingToList || isSaved
                      ? 'bg-gray-700/50 cursor-not-allowed' 
                      : 'bg-gray-500/30 hover:bg-gray-500/20 hover:scale-105'
                  } text-white font-semibold rounded backdrop-blur-sm transition-all duration-200`}
                  aria-label={
                    isSaved ? 'In Your List' : 'Add to My List'
                  }
                >
                  {isAddingToList ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : isSaved ? (
                    <Check className="w-5 h-5 text-white mr-2" />
                  ) : (
                    <Plus className="w-5 h-5 text-white mr-2" />
                  )}
                  {isAddingToList ? 'Processing...' : 'My List'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPlaying && movie.previewTrailer && (
        <div className="absolute !top-[120px] sm:!top-[150px] md:!top-[120px] lg:!top-[100px] right-6 sm:right-8 z-10">
          <div className="relative">
            <button
              onClick={handleToggleMute}
              className="group flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/50 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all duration-200 transform hover:scale-110"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>

            {showSoundPopup && (
              <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap animate-pulse border border-white/30 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Click to unmute</span>
                </div>

                <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90"></div>
              </div>
            )}
          </div>
        </div>
      )}
      {isPlaying && movie.maturityRating && (
        <div className="absolute right-0 bottom-20 bg-black/50 backdrop-blur-sm border-l-4 border-white px-4 py-6 flex items-center transition-all duration-500">
          <span className="text-white text-xl font-bold">
            {movie.maturityRating}
          </span>
        </div>
      )}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Full Movie Player */}
      <AnimatePresence>
        {showFullMovie && movie?.embedUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100]"
          >
            <VideoPlayer
              embedUrl={movie.embedUrl}
              onClose={() => setShowFullMovie(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
