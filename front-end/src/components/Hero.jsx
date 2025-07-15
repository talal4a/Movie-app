import { useState } from 'react';
import { Play, Plus, Info, ThumbsUp, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../api/auth';
import Spinner from './Spinner';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const { isLoading, data: movie } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    keepPreviousData: true,
    staleTime: 1000,
  });

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

        <div className="flex items-center space-x-6 mb-6 text-lg flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold text-xl">98% Match</span>
            <ThumbsUp className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-gray-300">{movie.releaseYear}</span>
          <span className="border border-gray-400 px-2 py-1 text-sm font-semibold">
            TV-14
          </span>
          <span className="text-gray-300">{movie.runtime}</span>
          <span className="bg-gray-800 px-2 py-1 text-sm rounded">4K</span>
          <span className="bg-gray-800 px-2 py-1 text-sm rounded flex items-center space-x-1">
            <span>{movie.ratings?.voteAverage?.toFixed(1)} </span>
          </span>
        </div>
        <p className="text-lg lg:text-xl text-gray-200 max-w-3xl mb-8 leading-relaxed">
          {movie.description}
        </p>
        <div className="flex  gap-4 mb-8 flex-wrap">
          <button
            onClick={handlePlay}
            className="bg-white  text-black font-bold px-8 py-3 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 text-lg shadow-lg transform hover:scale-105 w-[150px]"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button className="bg-gray-600 bg-opacity-80 text-white px-8 py-3 rounded-md hover:bg-gray-500 transition-all duration-200 flex items-center space-x-2 text-lg backdrop-blur-sm w-[170px]">
            <Plus className="w-6 h-6" />
            <span>My List</span>
          </button>

          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className="bg-gray-700 bg-opacity-80 text-white px-8 py-3 rounded-md hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2 text-lg backdrop-blur-sm w-[180px]"
          >
            <Info className="w-6 h-6" />
            <span>More Info</span>
          </button>
        </div>
        {showMoreInfo && (
          <div className="bg-black bg-opacity-90 p-6 rounded-lg max-w-3xl backdrop-blur-sm border border-gray-700 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-4">Cast & Crew</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-300 mb-2">
                  <strong>Starring:</strong>{' '}
                  {movie.cast
                    .map((actor) => `${actor.name} (${actor.character})`)
                    .join(', ')}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Rating:</strong> {movie.ratings?.voteAverage}/10 (
                  {movie.ratings?.voteCount} votes)
                </p>
              </div>
              <div>
                <p className="text-gray-300 mb-2">
                  <strong>Genres:</strong> {movie.genres.join(', ')}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Runtime:</strong> {movie.runtime}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre, i) => (
                <span
                  key={i}
                  className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <button
              onClick={() => setShowMoreInfo(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1"
            >
              <ChevronDown className="w-4 h-4 rotate-180" />
              <span>Less Info</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
