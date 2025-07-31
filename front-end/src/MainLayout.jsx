import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './components/Navbar';
import MobileNavbar from './components/MobileNavBar';
import NetflixFooter from './components/Footer';
import useIsMobile from './hooks/useIsMobile';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-black text-white">
      {isMobile ? <MobileNavbar /> : <NavBar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <NetflixFooter />
    </div>
  );
};

export default MainLayout;
