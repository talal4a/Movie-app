import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '@/api/movies';
import Spinner from '../ui/Spinner';
import VideoPlayer from '../ui/VideoPlayer';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '@/redux/slice/watchListSlice';
import { useToast } from '@/context/ToastContext';
import { useInView } from 'react-intersection-observer';
import HeroButton from './HeroButton';
import HeroDescription from './HeroDescription';
import HeroStats from './HeroStats';
import HeroTitle from './HeroTitle';
import HeroVideoBackground from './HeroVideoBackground';
import VolumeButton from './VolumeButton';
const Hero = ({ movie: movieProp }) => {
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
  const [wasPlayingBeforeHidden, setWasPlayingBeforeHidden] = useState(false);
  const [wasPlayingBeforeVideoPlayer, setWasPlayingBeforeVideoPlayer] =
    useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList.items);
  const { isLoading, data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    enabled: !movieProp,
    keepPreviousData: true,
    staleTime: 1000,
  });
  const movie = movieProp || movies;
  const isSaved =
    Array.isArray(watchlist) &&
    watchlist.some((item) => item && item._id === movie?._id);
  const fullTitle = movie?.title || '';
  const [mainTitle, ...rest] = fullTitle?.split(':') || [''];
  const subtitle = rest.length > 0 ? rest.join(':').trim() : '';
  const getConsistentMatch = (movie) => {
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
    const percentage = 70 + (Math.abs(hash) % 30);
    return percentage;
  };
  const matchPercentage =
    movie?.matchPercentage || movie?.match || getConsistentMatch(movie);
  const handleVideoEnded = useCallback(() => {
    setVideoEnded(true);
    setPreviewStarted(false);
    setAutoShowTooltip(false);
    setWasPlayingBeforeHidden(false);
    setTimeout(() => {
      setShowDescription(true);
    }, 500);
  }, []);
  const handlePlay = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setWasPlayingBeforeVideoPlayer(true);
    } else {
      setWasPlayingBeforeVideoPlayer(false);
    }
    setPreviewStarted(false);
    setIsPaused(true);
    setShowDescription(true);
    setAutoShowTooltip(false);
    setIsPlaying(true);
  }, []);
  const handleVideoPlayerClose = () => {
    setIsPlaying(false);
    if (
      wasPlayingBeforeVideoPlayer &&
      inView &&
      videoRef.current &&
      !videoEnded
    ) {
      setTimeout(() => {
        if (videoRef.current && inView && !document.hidden) {
          videoRef.current.play().catch((e) => {
            console.warn('Resume after video player close failed:', e);
          });
          setIsPaused(false);
          setPreviewStarted(true);
          setTimeout(() => {
            setShowDescription(false);
          }, 1000);
          setAutoShowTooltip(true);
          setTimeout(() => {
            setAutoShowTooltip(false);
          }, 3000);
        }
      }, 300);
    }
    setWasPlayingBeforeVideoPlayer(false);
  };
  const handleToggleWatchlist = useCallback(() => {
    if (!movie?._id) return;
    if (isSaved) {
      dispatch(removeFromWatchlist(movie._id));
      showToast('Removed from My List');
    } else {
      dispatch(addToWatchlist(movie));
      setJustAdded(true);
      showToast('Added to My List');
      setButtonDisabled(true);
      setTimeout(() => setButtonDisabled(false), 3000);
      setTimeout(() => setJustAdded(false), 3000);
    }
  }, [dispatch, isSaved, movie, showToast]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  }, [isMuted]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current && previewStarted && !videoEnded && !isPlaying) {
        if (document.hidden) {
          if (!videoRef.current.paused) {
            videoRef.current.pause();
            setWasPlayingBeforeHidden(true);
          }
        } else {
          if (wasPlayingBeforeHidden && inView) {
            videoRef.current.play().catch((e) => {
              console.warn('Resume after tab switch failed:', e);
            });
            setWasPlayingBeforeHidden(false);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [previewStarted, videoEnded, wasPlayingBeforeHidden, inView, isPlaying]);
  useEffect(() => {
    if (isPlaying) return;
    let delayTimeout;
    if (inView && !hasPlayed && videoRef.current) {
      delayTimeout = setTimeout(() => {
        videoRef.current.play().catch((e) => {
          console.warn('Autoplay failed:', e);
        });
        setHasPlayed(true);
        setPreviewStarted(true);
        setIsPaused(false);
        setTimeout(() => {
          setShowDescription(false);
        }, 1000);
        setAutoShowTooltip(true);
        setTimeout(() => {
          setAutoShowTooltip(false);
        }, 3000);
      }, 1300);
    } else if (!inView && videoRef.current && previewStarted && !videoEnded) {
      videoRef.current.pause();
      setIsPaused(true);
      setPreviewStarted(false);
      setShowDescription(true);
      setAutoShowTooltip(false);
      setWasPlayingBeforeHidden(false);
    } else if (
      inView &&
      hasPlayed &&
      videoRef.current &&
      isPaused &&
      !videoEnded
    ) {
      delayTimeout = setTimeout(() => {
        if (videoRef.current && inView && !document.hidden) {
          videoRef.current.play().catch((e) => {
            console.warn('Resume failed:', e);
          });
          setIsPaused(false);
          setPreviewStarted(true);
          setTimeout(() => {
            setShowDescription(false);
          }, 1000);
          setAutoShowTooltip(true);
          setTimeout(() => {
            setAutoShowTooltip(false);
          }, 3000);
        }
      }, 800);
    }
    return () => {
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [inView, hasPlayed, previewStarted, videoEnded, isPaused, isPlaying]);
  if (isLoading || !movie) {
    return (
      <div className="relative h-screen w-full bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <section
      ref={ref}
      className="relative w-full h-screen text-white overflow-hidden"
    >
      <HeroVideoBackground
        videoRef={videoRef}
        movie={movie}
        videoEnded={videoEnded}
        isPaused={isPaused}
        previewStarted={previewStarted}
        isPlaying={isPlaying}
        onEnded={handleVideoEnded}
      />
      <div
        className={`absolute top-24 right-4 sm:top-28 sm:right-6 lg:top-32 lg:right-8 z-20 transition-all duration-500 ease-in-out ${
          previewStarted && !videoEnded && !isPlaying
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4 pointer-events-none'
        }`}
      >
        <VolumeButton
          isMuted={isMuted}
          onToggle={toggleMute}
          showTooltip={showVolumeTooltip}
          autoTooltip={autoShowTooltip}
          onMouseEnter={() => setShowVolumeTooltip(true)}
          onMouseLeave={() => setShowVolumeTooltip(false)}
          disabled={!previewStarted || videoEnded || isPlaying}
        />
      </div>
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 max-w-none">
        <HeroTitle mainTitle={mainTitle} subtitle={subtitle} />
        <HeroStats
          matchPercentage={matchPercentage}
          releaseYear={movie.releaseYear}
        />
        <HeroDescription
          showDescription={showDescription}
          description={movie.overview || movie.description}
        />
        <div className="flex items-center gap-3 sm:gap-4">
          <HeroButton
            isSaved={isSaved}
            justAdded={justAdded}
            buttonDisabled={buttonDisabled}
            onPlay={handlePlay}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>
      </div>
      {isPlaying && movie?.trailer && (
        <VideoPlayer
          videoUrl={movie.trailer}
          isOpen={isPlaying}
          onClose={handleVideoPlayerClose}
        />
      )}
    </section>
  );
};
export default Hero;
