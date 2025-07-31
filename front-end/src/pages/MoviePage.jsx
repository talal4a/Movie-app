import GroupedMovieCollections from '@/components/GroupedMovieCollections';
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
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-background bg-black"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      <main className="p-10 ">
        <section className="my-10">
          <GroupedMovieCollections />
        </section>
      </main>
    </motion.div>
  );
}
