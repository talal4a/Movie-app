import MovieRow from '../components/MovieRow';
import Hero from '../components/Hero';
import React, { useEffect } from 'react';
import LatestMovies from '../components/LatestMovie';
import GenreSection from '../components/GenreSection';
import MobileNavbar from '@/components/MobileNavBar';
import NavBar from '@/components/Navbar';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axioInstance';
export default function Home() {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'];
   const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['movies-collection', 'Trending'],
      queryFn: async () => {
        const res = await axiosInstance.get('movies/grouped');
        return res.data['Trending'] || [];
      },
    });
  }, []);
  return (
    <div className="flex flex-col  min-h-screen bg-background text-foreground bg-black">
      <div className="md:hidden">
        <MobileNavbar />
      </div>
      <div className="hidden md:block">
        <NavBar />
      </div>
      <Hero />
      <MovieRow title="Trending Now" />
      <LatestMovies />
      {genres.map((genre) => (
        <GenreSection key={genre} genre={genre} />
      ))}
    </div>
  );
}
