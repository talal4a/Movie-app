import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Plus, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMovieById } from '../api/auth';
import Spinner from '../components/Spinner';
import Review from '../components/Review';
import ReviewsList from '../components/ReviewList';
import VideoPlayer from '@/components/VideoPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/context/ToastContext';
import { addToWatchlist, removeFromWatchlist } from '@/slice/watchListSlice';
import RelatedMovies from '@/components/RelatedMovies';
import RecommendedMovies from '@/components/RecommendationMovie';
export default function MovieDetail() {
  const { id } = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const watchlist = useSelector((state) => state.watchList?.items || []);
  const {
    data: movie,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });
  const isSaved =
    Array.isArray(watchlist) &&
    movie &&
    watchlist.some((item) => item?._id === movie._id);
  const toggleWatchlist = () => {
    if (!movie) return;
    if (isSaved) {
      dispatch(removeFromWatchlist(movie._id));
      showToast({ message: 'Removed from Watchlist', type: 'success' });
    } else {
      dispatch(addToWatchlist(movie._id));
      setJustAdded(true);
      setButtonDisabled(true);
      showToast({ message: 'Added to Watchlist', type: 'success' });
      setTimeout(() => {
        setJustAdded(false);
        setButtonDisabled(false);
      }, 2000);
    }
  };
  useEffect(() => {
    document.body.style.overflow = showPlayer ? 'hidden' : '';
  }, [showPlayer]);
  useEffect(() => {
    if (!movie?.backdrop) return;
    const img = new Image();
    img.src = movie.backdrop;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [movie?.backdrop]);
  if (isLoading || !movie) return <Spinner />;
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
            fetchPriority="high"
            style={{
              objectPosition: 'center top',
              minHeight: '100vh',
              minWidth: '100vw',
              transform: 'translateY(13px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        </div>
        <div className="relative h-full flex items-center md:items-end">
          <div className="px-4 md:px-16 pb-8 md:pb-16 max-w-2xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
              <span className="text-green-400 font-semibold">
                {Math.round(movie.tmdbRatings.average * 10)}% Match
              </span>
              <span className="border border-gray-500 px-1 text-xs">
                {movie.ratings?.certification || 'PG-13'}
              </span>
              <span>{movie.runtime}</span>
              <span className="border border-gray-500 px-1 text-xs">HD</span>
            </div>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
              {movie.description}
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowPlayer(true)}
                className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Play
              </button>
              <button
                onClick={toggleWatchlist}
                disabled={buttonDisabled}
                className={`px-8 py-3 rounded font-semibold transition-colors flex items-center gap-2 ${
                  isSaved || justAdded
                    ? 'bg-gray-400 text-black cursor-not-allowed'
                    : 'bg-gray-600/80 text-white hover:bg-gray-600'
                }`}
              >
                {isSaved || justAdded ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>My List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <RelatedMovies id={id} />
      <div className="px-4 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {movie.cast?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Cast</h2>
                  <div className="flex flex-wrap gap-4 space-y-1">
                    {movie.cast
                      .filter((actor) => actor.avatar)
                      .slice(0, 6)
                      .map((actor, index) => (
                        <div
                          key={index}
                          className="flex w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)] items-center gap-4"
                        >
                          <img
                            src={actor.avatar}
                            alt={actor.name}
                            className="w-16 h-16 rounded-full object-cover border border-gray-700"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {actor.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {actor.character}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <Review id={movie._id} refetchMovie={refetch} />
            <ReviewsList id={movie._id} />
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Genres:
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-1 md:max-w-[90%]">
                  {movie.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="text-white text-xs sm:text-sm md:text-xs lg:text-sm whitespace-nowrap"
                    >
                      {genre}
                      {i < movie.genres.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Release Year: </span>
                  <span className="text-white">{movie.releaseYear}</span>
                </div>
                <div>
                  <div></div>
                  <span className="text-white">{movie.runtime}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400"> TMDb Rating: </span>
                <span>
                  {movie?.tmdbRatings?.average?.toFixed(1) ?? 'N/A'} ⭐
                </span>
              </div>
              <div>
                <span className="text-gray-400"> Total Votes: </span>
                <span>{movie?.tmdbRatings?.count ?? 0}</span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  About this movie:
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <RecommendedMovies genre={movie.genres} id={id} />
      </div>

      {showPlayer && (
        <VideoPlayer
          embedUrl={movie.embedUrl}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
