import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMovieById } from '../api/auth';
import Spinner from '../components/Spinner';
import Review from '../components/Review';
import ReviewsList from '../components/ReviewList';
import VideoPlayer from '@/components/VideoPlayer';
import RelatedMovies from '@/components/RelatedMovies';
import RecommendedMovies from '@/components/RecommendationMovie';
import Hero from '@/components/Hero';
export default function MovieDetail() {
  const { id } = useParams();
  const [showPlayer, setShowPlayer] = useState(false);
  useEffect(() => {
    if (showPlayer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPlayer]);

  const {
    data: movie,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });
  if (isLoading || !movie) return <Spinner />;
  return (
    <div className="bg-black text-white min-h-screen">
      <Hero movie={movie} />
      <RelatedMovies id={movie._id} />
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
