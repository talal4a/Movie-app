import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from '@/components/Search/SearchInput';
import { searchMovies } from '@/api/movies';
import SearchResult from '@/components/Search/SearchResult';
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
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
  return (
    <div className="min-h-screen bg-black text-white relative">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          <div className=" flex top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-4 justify-between items-center">
            <div className="flex">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center w-12 h-12 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>
            <div className="mx-auto ">Search</div>
          </div>
          <div className="w-full px-4 py-6">
            <div className="mb-8">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                onClear={() => {
                  setSearchInput('');
                  setQuery('');
                  setSearchParams({});
                }}
                loading={isLoading}
              />
              {error && (
                <p className="text-red-500 text-center mt-4">
                  Something went wrong. Please try again.
                </p>
              )}
              {query && movies?.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 mt-8">
                  No results found for "{query}".
                </p>
              )}
            </div>
            {movies?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-8"
              >
                <SearchResult query={query} movies={movies} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
