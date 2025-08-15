import Hero from '../Hero/Hero';
import RecommendedMovies from '../Features/RecommendationMovie';
import RelatedMovies from '../Features/RelatedMovies';
import CastList from './CastList';
import MovieMeta from './MovieMeta';
import MovieReviews from './MovieReviews';
export default function MovieDetailLayout({ movie, refetchMovie, id, setShowPlayer }) {
  return (
    <>
      <Hero 
        movie={movie} 
        onPlayClick={() => setShowPlayer(true)}
      />
      <RelatedMovies id={movie._id} />
      <div className="px-4 md:px-16 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <CastList cast={movie.cast} />
          </div>
          <MovieReviews id={movie._id} refetchMovie={refetchMovie} />
          <MovieMeta movie={movie} />
        </div>
        <RecommendedMovies genre={movie.genres} id={id} />
      </div>
    </>
  );
}
