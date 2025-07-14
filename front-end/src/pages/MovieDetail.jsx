import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMovieById } from '../api/auth';
import Spinner from '../components/Spinner';
import Review from '../components/Review';
export default function MovieDetail() {
  const { id } = useParams();
  const [showPlayer, setShowPlayer] = useState(false);
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });
  useEffect(() => {
    if (showPlayer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showPlayer]);
  if (isLoading || !movie) return <Spinner />;
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
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
                {Math.round(movie.ratings?.voteAverage * 10)}% Match
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
              <button className="bg-gray-600/80 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                My List
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {movie.cast?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.cast.slice(0, 6).map((actor, index) => (
                      <div key={index} className="text-gray-300">
                        <div className="font-medium text-white">
                          {actor.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {actor.character}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Review id={movie._id} />
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Genres:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, i) => (
                    <span key={i} className="text-white text-sm">
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
                  <span className="text-gray-400">Runtime: </span>
                  <span className="text-white">{movie.runtime}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating: </span>
                  <span className="text-white">
                    {Number(movie.ratings?.voteAverage).toFixed(1)} ⭐
                  </span>
                </div>
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
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="w-[90%] max-w-5xl relative">
            <iframe
              src={movie.embedUrl}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full aspect-video rounded-xl"
            />
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-black/90"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
