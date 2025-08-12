import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Clock,
  Calendar,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import MovieCard from './MovieCard';

const MovieCarousel = ({
  movies = [],
  title = 'Trending Now',
  subtitle = 'Popular Movies',
  autoRotate = true,
  rotateInterval = 5000,
  isMobileSwipe = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || !isInView || isHovering || !movies.length) return;

    const interval = setInterval(() => {
      nextSlide();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [
    autoRotate,
    isInView,
    isHovering,
    movies.length,
    rotateInterval,
    activeIndex,
  ]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Touch event handlers for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  const currentMovie = movies[activeIndex];

  return (
    <section
      ref={carouselRef}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black"></div>
        {currentMovie && (
          <motion.img
            key={currentMovie._id}
            src={
              currentMovie.backdrop ||
              currentMovie.poster ||
              currentMovie.image ||
              ''
            }
            alt=""
            className="w-full h-full object-cover opacity-30 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="group relative p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 overflow-hidden"
              aria-label="Previous slide"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <ChevronLeft className="w-5 h-5 relative z-10" />
            </button>
            <button
              onClick={nextSlide}
              className="group relative p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 overflow-hidden"
              aria-label="Next slide"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <ChevronRight className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full h-[550px] md:h-[650px] flex items-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {movies.map((movie, index) => {
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = index === activeIndex;

              // Only render visible cards
              if (absOffset > 2) return null;

              return (
                <motion.div
                  key={movie._id || index}
                  className="absolute"
                  style={{
                    zIndex: 20 - absOffset * 5,
                  }}
                  initial={false}
                  animate={{
                    x: offset * (isMobile ? 80 : 120) + 'px',
                    scale: isActive ? 1 : 0.85 - absOffset * 0.1,
                    rotateY: offset * -10 + 'deg',
                    opacity: absOffset > 1 ? 0 : 1 - absOffset * 0.3,
                    filter: isActive ? 'blur(0px)' : `blur(${absOffset * 2}px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    className={`
                      w-[280px] md:w-[320px] lg:w-[360px] 
                      transition-all duration-500 cursor-pointer
                      ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}
                    `}
                    onClick={() => !isActive && setActiveIndex(index)}
                  >
                    {/* Enhanced Movie Card */}
                    <div className="relative group">
                      {/* Glow effect for active card */}
                      {isActive && (
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-20 blur-2xl animate-pulse"></div>
                      )}

                      <div
                        className={`
                        relative rounded-2xl overflow-hidden
                        bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95
                        backdrop-blur-xl border transition-all duration-500
                        ${isActive ? 'border-white/20 shadow-2xl' : 'border-white/10 shadow-xl'}
                      `}
                      >
                        {/* Movie Poster */}
                        <div className="relative h-[400px] md:h-[480px] overflow-hidden">
                          <img
                            src={
                              movie.poster ||
                              movie.image ||
                              movie.thumbnail ||
                              ''
                            }
                            alt={movie.title || movie.name || ''}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                          {/* Play Button - Only on active */}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <motion.div
                                className="bg-white/20 backdrop-blur-md rounded-full p-5"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Play className="w-10 h-10 text-white fill-white" />
                              </motion.div>
                            </div>
                          )}

                          {/* Rating Badge */}
                          {(movie.rating || movie.vote_average) && (
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-semibold text-sm">
                                {movie.rating || movie.vote_average}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Movie Info */}
                        <div
                          className={`p-5 space-y-3 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`}
                        >
                          <h3 className="text-lg md:text-xl font-bold text-white truncate">
                            {movie.title || movie.name || 'Untitled'}
                          </h3>

                          {/* Meta Info - Only show on active */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="flex items-center gap-3 text-sm text-gray-400"
                            >
                              {movie.year && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{movie.year}</span>
                                </div>
                              )}
                              {movie.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{movie.duration}</span>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* Genres - Only show on active */}
                          {isActive &&
                            movie.genre &&
                            Array.isArray(movie.genre) && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-2"
                              >
                                {movie.genre.slice(0, 3).map((g, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-full text-xs text-gray-300"
                                  >
                                    {g}
                                  </span>
                                ))}
                              </motion.div>
                            )}

                          {/* Description - Only show on active */}
                          {isActive && movie.description && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-sm text-gray-400 line-clamp-2"
                            >
                              {movie.description}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="relative h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-300"
              style={{
                width: index === activeIndex ? '40px' : '20px',
              }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{
                    duration: rotateInterval / 1000,
                    ease: 'linear',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
