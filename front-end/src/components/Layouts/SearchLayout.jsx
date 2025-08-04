import { AnimatePresence, motion } from 'framer-motion';

const SearchLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col min-h-screen"
          >
            <main className="flex-1">
              {children}
            </main>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default SearchLayout;
