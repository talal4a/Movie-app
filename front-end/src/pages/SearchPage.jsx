import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMovies } from '@/api/movies';
import SearchResult from '@/components/Search/SearchResult';
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery && urlQuery !== searchInput) {
      setSearchInput(urlQuery);
      setQuery(urlQuery);
    }
  }, [searchParams]);
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
    window.scrollTo(0, 0);

    const urlQuery = searchParams.get('q') || '';
    if (urlQuery) {
      setSearchInput(urlQuery);
      setQuery(urlQuery);
    }
  }, []);
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClearSearch = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-black text-white relative md:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-4 space-y-4">
            <div className="hidden md:flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-lg text-gray-300 mb-4">
                Please use the search bar in the navigation menu
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Return Home
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center w-12 h-12 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search movies..."
                className="block w-full pl-12 pr-10 py-3 bg-zinc-900/80 border border-zinc-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                aria-label="Search movies"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full px-4 py-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                Error loading search results. Please try again.
              </div>
            ) : query.length >= 3 && (!movies || movies.length === 0) ? (
              <div className="text-center py-12 text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <SearchResult query={query} movies={movies || []} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
