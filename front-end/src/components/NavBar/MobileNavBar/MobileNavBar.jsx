import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slice/userSlice';
import { useToast } from '@/context/ToastContext';
import MobileSidebar from './MobileSidebar';
import NavbarHeader from './NavbarHeader';
import ProfileMenu from './ProfileMenu';
const MobileNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isSearchPage = location.pathname === '/search';
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isSidebarOpen || isProfileOpen ? 'hidden' : 'auto';
  }, [isSidebarOpen, isProfileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
    showToast({ message: 'Logged out successfully', type: 'success' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <>
      <div className="relative">
        <NavbarHeader
          isScrolled={isScrolled}
          onMenuClick={toggleSidebar}
          onSearchClick={handleSearchClick}
          onProfileClick={toggleProfile}
          isProfileOpen={isProfileOpen}
          showSearchButton={!isSearchPage}
          user={user}
        />

        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div
          className={`fixed right-4 top-16 z-50 transition-all duration-200 transform origin-top-right ${
            isProfileOpen
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
          ref={profileMenuRef}
        >
          <ProfileMenu
            user={user}
            onLogout={handleLogout}
            onClose={closeProfile}
          />
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
