import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import SearchInput from '@/components/Search/SearchInput';
import SearchResults from '@/components/Search/SearchResults';
import { searchMovies } from '@/api/movies';
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
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
    <div className="min-h-screen bg-black text-white px-4 pt-36 pb-12 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search</h1>
          <p className="text-gray-400">Find your next favorite movie</p>
        </div>
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
          <p className="text-red-500 text-center mt-8">
            Something went wrong. Try again.
          </p>
        )}
        {query && movies?.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-8">
            No results found for "{query}".
          </p>
        )}
      </div>
      {movies?.length > 0 && (
        <div className="mt-12">
          <SearchResults query={query} movies={movies} />
        </div>
      )}
    </div>
  );
}
