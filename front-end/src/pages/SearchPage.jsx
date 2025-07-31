import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/api/auth';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import MovieCard from '@/components/MovieCard';
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const debouncedSearch = debounce((value) => {
    if (value.length >= 3) {
      setSearchParams({ q: value });
      setQuery(value);
    } else {
      setSearchParams({});
      setQuery('');
    }
  }, 500);
  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput]);
  const {
    data: movies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMovies(query),
    enabled: query.length >= 3,
  });
  const clearSearch = () => {
    setSearchInput('');
    setQuery('');
    setSearchParams({});
  };
  return (
    <div className="min-h-screen bg-black   text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,0,0,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      </div>
      <div className="relative z-10 ">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
                  Search
                </h1>
                <p className="text-gray-400 text-lg">
                  Discover thousands of movies
                </p>
              </div>
              <div className="relative group">
                <div
                  className={`relative transition-all duration-500 ease-out ${
                    isFocused ? 'transform scale-[1.02]' : ''
                  }`}
                >
                  <div
                    className={`relative flex items-center bg-gray-900/90 backdrop-blur-xl rounded-xl border transition-all duration-500 ${
                      isFocused
                        ? 'border-red-500 shadow-2xl shadow-red-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="pl-6 pr-4">
                      <svg
                        className={`w-6 h-6 transition-all duration-300 ${
                          isFocused ? 'text-red-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search for movies"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-5 pr-4 outline-none text-lg font-medium"
                    />
                    {searchInput && (
                      <button
                        onClick={clearSearch}
                        className="pr-6 pl-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    {isLoading && (
                      <div className="pr-6 pl-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>
                {query.length < 3 && searchInput.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-b-xl mt-2 p-4 text-gray-400 text-sm shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Type at least 3 characters to search
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                  <svg
                    className="w-full h-full text-red-500 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.052 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Something went wrong
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't fetch your search results. Please check your
                  connection and try again.
                </p>
              </div>
            </div>
          )}
          {query && movies?.length === 0 && !isLoading && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gray-500/20 rounded-full animate-pulse"></div>
                  <svg
                    className="w-full h-full text-gray-500 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">No results found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-2">
                  Your search for "
                  <span className="text-white font-semibold">{query}</span>"
                  didn't match any titles.
                </p>
                <p className="text-gray-500 text-sm">
                  Try different keywords or check your spelling.
                </p>
              </div>
            </div>
          )}
          {movies?.length > 0 && (
            <div className="animate-in fade-in duration-700">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Search Results
                </h2>
                <p className="text-gray-400">
                  {movies.length} {movies.length === 1 ? 'result' : 'results'}
                  for "
                  <span className="text-red-500 font-semibold">{query}</span>"
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {movies.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="group cursor-pointer"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!searchInput && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-8 relative">
                  <div className="absolute inset-0 rounded-full "></div>
                  <svg
                    className="w-full h-full text-gray-600 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Find your next favorite movie
                </h3>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Search through our vast collection of movies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
