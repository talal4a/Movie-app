import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar/Navbar';
import NetflixFooter from './components/Footer/Footer';
import useIsMobile from './hooks/useIsMobile';
import AuthWatcher from './components/ui/AuthWatcher';
import MobileNavbar from './components/NavBar/MobileNavBar/MobileNavBar';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 10);
      // Always scroll to top when route changes
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      return () => clearTimeout(timer);
    };

    handleRouteChange();
  }, [location.pathname]);

  // Disable browser's automatic scroll restoration so we fully control it
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // List of routes where we don't want to show the navbar
  const hideNavbarRoutes = [
    '/auth/login',
    '/auth/signup',
    '/forgot-password',
    '/auth/reset-password',
  ];

  const shouldShowNavbar = !hideNavbarRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
      <AuthWatcher />
      {shouldShowNavbar && (isMobile ? <MobileNavbar /> : <NavBar />)}
      <div className="flex-1">
        <div 
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Outlet />
        </div>
      </div>
      {shouldShowNavbar && <NetflixFooter />}
    </div>
  );
};

export default MainLayout;
