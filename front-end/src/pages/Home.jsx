import MovieRow from '../components/MovieRow';
import Hero from '../components/Hero';
import React from 'react';
import LatestMovies from '../components/LatestMovie';
import GenreSection from '../components/GenreSection';
import MobileNavbar from '@/components/MobileNavBar';
import NavBar from '@/components/Navbar';
export default function Home() {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'];
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
