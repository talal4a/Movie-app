import { Outlet } from 'react-router-dom';
import NavBar from './components/Navbar';
import useIsMobile from './hooks/useIsMobile';
import MobileNavbar from './components/MobileNavBar';
import NetflixFooter from './components/Footer';
const MainLayout = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? <MobileNavbar /> : <NavBar />}
      <main>
        <Outlet />
      </main>
      <NetflixFooter />
    </>
  );
};
export default MainLayout;
