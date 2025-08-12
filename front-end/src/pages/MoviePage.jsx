import GroupedMovieCollections from '@/components/Features/GroupedMovieCollections';
import MovieCarousel from '@/components/ui/MovieCarousel';

import { motion } from 'framer-motion';

export default function MoviesPage() {
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const transition = {
    duration: 0.5,
    ease: 'easeInOut',
  };

  const trendingMovies = [
    {
      _id: '1',
      title: 'Inception',
      overview:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      poster:
        'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      backdrop:
        'https://image.tmdb.org/t/p/original/8riQbU399FDRq2ImfJalEAfPPNf.jpg',
      releaseDate: '2010-07-15',
      rating: 8.4,
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      runtime: 148,
      tagline: 'Your mind is the scene of the crime.',
    },
    {
      _id: '2',
      title: 'The Shawshank Redemption',
      overview:
        'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
      poster:
        'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      backdrop:
        'https://image.tmdb.org/t/p/original/wPU78OPN4BYEgWYdXyg0phMee64.jpg',
      releaseDate: '1994-09-23',
      rating: 8.7,
      genres: ['Drama', 'Crime'],
      runtime: 142,
      tagline: 'Fear can hold you prisoner. Hope can set you free.',
    },
    {
      _id: '3',
      title: 'The Dark Knight',
      overview:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      poster:
        'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop:
        'https://image.tmdb.org/t/p/original/7aDM1Rba57BeXr0jWRa3kBgEDUz.jpg',
      releaseDate: '2008-07-16',
      rating: 8.5,
      genres: ['Drama', 'Action', 'Crime', 'Thriller'],
      runtime: 152,
      tagline: 'Why So Serious?',
    },
    {
      _id: '4',
      title: 'Pulp Fiction',
      overview:
        "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this crime saga.",
      poster:
        'https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      backdrop:
        'https://image.tmdb.org/t/p/original/4q2h2S8GbG1uxviC3dTiR5X9ZJ9.jpg',
      releaseDate: '1994-09-10',
      rating: 8.5,
      genres: ['Thriller', 'Crime'],
      runtime: 154,
      tagline:
        "Just because you are a character doesn't mean you have character.",
    },
    {
      _id: '5',
      title: 'The Godfather',
      overview:
        'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
      poster:
        'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      backdrop:
        'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',
      releaseDate: '1972-03-14',
      rating: 8.7,
      genres: ['Drama', 'Crime'],
      runtime: 175,
      tagline: "An offer you can't refuse.",
    },
  ];

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-background bg-black"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      <main className="p-10">
        {/* Top carousel */}
        <section className="my-10">
          <MovieCarousel movies={trendingMovies} />
        </section>

        {/* Your grouped movie collections */}
        <section className="my-10">
          <GroupedMovieCollections />
        </section>
      </main>
    </motion.div>
  );
}
