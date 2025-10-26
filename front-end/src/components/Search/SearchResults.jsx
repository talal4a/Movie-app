import MovieCard from '../ui/MovieCard';
export default function SearchResults({ query, movies }) {
  return (
    <div className="animate-in fade-in duration-700 ">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h2>
        <p className="text-gray-400">
          {movies.length} {movies.length === 1 ? 'result' : 'results'} for "
          <span className="text-red-500 font-semibold">{query}</span>"
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ">
        {movies.map((movie) => (
          <div key={movie._id} className="group cursor-pointer">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
