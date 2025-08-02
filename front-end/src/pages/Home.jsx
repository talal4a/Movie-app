import MovieRow from '../components/MovieRow';
import Hero from '../components/Hero/Hero';
import React, { useEffect } from 'react';
import LatestMovies from '../components/LatestMovie';
import GenreSection from '../components/GenreSection';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axioInstance';
import { motion } from 'framer-motion';
const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};
const transition = {
  duration: 0.5,
  ease: 'easeInOut',
};

export default function Home() {
  useEffect(() => {
    console.log('MoviePage mounted');
    return () => console.log('MoviePage unmounted');
  }, []);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'];
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['movies-collection', 'Trending'],
      queryFn: async () => {
        const res = await axiosInstance.get('movies/grouped');
        return res.data['Trending'] || [];
      },
      staleTime: 10 * 60 * 1000,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: 2,
    });
  }, []);
  return (
    <motion.div
      className="flex flex-col gap-10"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      <Hero />
      <MovieRow title="Trending Now" />
      <LatestMovies />
      {genres.map((genre) => (
        <GenreSection key={genre} genre={genre} />
      ))}
    </motion.div>
  );
}
