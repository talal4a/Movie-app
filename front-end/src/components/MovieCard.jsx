import { Plus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`}>
      <div className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 w-45">
        <div className="w-full h-60 overflow-hidden relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-black rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 mt-[90px]">
            <button className="bg-white text-black rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-3 text-white space-y-1">
          <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-gray-400">{movie.releaseYear}</p>
          <p className="text-xs text-gray-400">{movie.runtime}</p>

          <div className="flex flex-wrap gap-1">
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="text-[10px] bg-gray-700 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 text-xs font-medium">
              ⭐ {movie.ratings?.voteAverage?.toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
