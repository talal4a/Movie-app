import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './components/Navbar';
import MobileNavbar from './components/MobileNavBar';
import NetflixFooter from './components/Footer';
import useIsMobile from './hooks/useIsMobile';
import { AnimatePresence, motion } from 'framer-motion';
import AuthWatcher from './components/AuthWatcher';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-black text-white">
      <AuthWatcher />
      {isMobile ? <MobileNavbar /> : <NavBar />}
      <AnimatePresence mode="wait">
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col min-h-screen"
          >
            <main className="flex-1">
              <Outlet />
            </main>
            <NetflixFooter />
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
