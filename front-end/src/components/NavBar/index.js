import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchButton from './SearchButton';
import ProfileMenu from './ProfileMenu';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;

  return (
    <nav
      className={`fixed z-50 flex items-center px-6 py-3 text-white w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-black bg-opacity-95 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-b from-black via-black/50 to-transparent'
      }`}
    >
      <Logo />
      <Navigation />
      <div className="flex items-center space-x-4">
        <SearchButton isSearchPage={isSearchPage} />
        <ProfileMenu user={user} />
      </div>
    </nav>
  );
};

export default React.memo(NavBar);
