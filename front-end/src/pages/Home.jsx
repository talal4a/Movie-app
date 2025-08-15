import MovieRow from '../components/ui/MovieRow';
import React from 'react';
import LatestMovies from '../components/Features/LatestMovie';
import GenreSection from '../components/Features/GenreSection';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '@/api/movies';
import { motion, AnimatePresence } from 'framer-motion';
import ContinueWatching from '@/components/Features/ContinueWatching';
import Hero from './../components/Hero/Hero';
const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5,
};
export default function Home() {
  const { data: featuredMovie } = useQuery({
    queryKey: ['featured-movie'],
    queryFn: async () => {
      const movies = await fetchMovies({ limit: 1 });
      return movies[0] || null;
    },
    staleTime: 60 * 60 * 1000,
  });
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col gap-10"
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={pageTransition}
      >
        <Hero movie={featuredMovie} />
        <MovieRow title="Trending Now" />
        <ContinueWatching />
        <LatestMovies />
        {genres.map((genre) => (
          <GenreSection key={genre} genre={genre} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
