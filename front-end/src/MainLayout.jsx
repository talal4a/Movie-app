import { Outlet } from 'react-router-dom';
import NavBar from './components/Navbar';
import useIsMobile from './hooks/useIsMobile';
import MobileNavbar from './components/MobileNavBar';
const MainLayout = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? <MobileNavbar /> : <NavBar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
