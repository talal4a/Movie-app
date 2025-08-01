import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMovieById } from '../api/movies';
import Spinner from '../components/Spinner';
import VideoPlayer from '@/components/VideoPlayer';
import MovieDetailLayout from '@/components/MovieDetail/MovieDetailLayout';
export default function MovieDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [showPlayer, setShowPlayer] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    document.body.style.overflow = showPlayer ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [showPlayer]);
  queryClient.prefetchQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });
  const {
    data: movie,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });
  if (isLoading || !movie) return <Spinner />;
  return (
    <div className="bg-black text-white min-h-screen">
      <MovieDetailLayout
        movie={movie}
        setShowPlayer={setShowPlayer}
        refetchMovie={refetch}
        id={id}
      />
      {showPlayer && (
        <VideoPlayer
          embedUrl={movie.embedUrl}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
