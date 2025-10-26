export default function MovieMeta({ movie }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Genres:</h3>
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
          <span className="text-gray-400">Runtime: </span>
          <span className="text-white">{movie.runtime}</span>
        </div>
        <div>
          <span className="text-gray-400">TMDb Rating: </span>
          <span>{movie?.tmdbRatings?.average?.toFixed(1) ?? 'N/A'} ⭐</span>
        </div>
        <div>
          <span className="text-gray-400">Total Votes: </span>
          <span>{movie?.tmdbRatings?.count ?? 0}</span>
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
  );
}
