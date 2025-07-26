import { useState } from 'react';
import { getRelatedMovies } from '@/api/movies';
import { useQuery } from '@tanstack/react-query';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function RelatedMovies({ id }) {
  const { data: relatedData, isLoading } = useQuery({
    queryKey: ['related-movies', id],
    queryFn: () => getRelatedMovies(id),
    enabled: !!id,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const chunkSize = 6;
  if (isLoading || !relatedData?.length) return null;
  const chunks = [];
  for (let i = 0; i < relatedData.length; i += chunkSize) {
    chunks.push(relatedData.slice(i, i + chunkSize));
  }
  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };
  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, chunks.length - 1));
  };
  const isSlider = relatedData.length >= chunkSize;
  return (
    <div className="px-4 md:px-16 mt-12 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Related Movies in Collection
      </h2>
      {isSlider ? (
        <>
          <div className="flex justify-between items-center mb-4 w-full px-2 ">
            <button
              className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 disabled:opacity-40"
              onClick={handlePrev}
              disabled={currentSlide === 0}
            >
              <ChevronLeft />
            </button>
            <button
              className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 disabled:opacity-40"
              onClick={handleNext}
              disabled={currentSlide === chunks.length - 1}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chunks[currentSlide].map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedData.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
