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
      return () => clearTimeout(timer);
    };

    handleRouteChange();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AuthWatcher />
      {isMobile ? <MobileNavbar /> : <NavBar />}
      <div className="flex-1">
        <div 
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-in-out',
            height: '100%',
          }}
        >
          <Outlet />
        </div>
      </div>
      <NetflixFooter />
    </div>
  );
};

export default MainLayout;
