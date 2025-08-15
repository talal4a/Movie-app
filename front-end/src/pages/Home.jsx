import MovieRow from '../components/ui/MovieRow';

import React, { useEffect } from 'react';
import LatestMovies from '../components/Features/LatestMovie';
import GenreSection from '../components/Features/GenreSection';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMovies } from '@/api/movies';
import axiosInstance from '@/api/axioInstance';
import { motion } from 'framer-motion';
import ContinueWatching from '@/components/Features/ContinueWatching';
import Hero from './../components/Hero/Hero';

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
  const { data: featuredMovie, isLoading } = useQuery({
    queryKey: ['featured-movie'],
    queryFn: async () => {
      const movies = await fetchMovies({ limit: 1 });
      return movies[0] || null;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  useEffect(() => {
    console.log('Home mounted');
    return () => console.log('Home unmounted');
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
      <Hero movie={featuredMovie} />
      <MovieRow title="Trending Now" />
      <ContinueWatching />
      <LatestMovies />
      {genres.map((genre) => (
        <GenreSection key={genre} genre={genre} />
      ))}
    </motion.div>
  );
}
