import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, LogOut, HelpCircle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '@/slice/userSlice';
import UserAvatar from './UserAvatar';
import { useToast } from '@/context/ToastContext';
import LogoutConfirm from './LogoutConfirm';
import Modal from './Modals/Modal';
import useOutsideClick from '@/hooks/useOutsideClick';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const profileRef = useOutsideClick({ handler: () => setShowProfile(false) });
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setQuery('');
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
    showToast({ message: 'Logout successfully', type: 'success' });
  };

  // Navigate to search page when user types 3+ characters
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setShowSearch(false);
      setQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setQuery('');
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setShowSearch(false);
    setQuery('');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeClass = (isActive) =>
    isActive
      ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
      : 'text-gray-300 hover:text-white transition-colors duration-200';

  const NavItem = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => activeClass(isActive)}>
      {children}
    </NavLink>
  );

  return (
    <nav
      className={`fixed z-50 flex items-center px-6 py-3 text-white w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-black bg-opacity-95 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-b from-black via-black/50 to-transparent'
      }`}
    >
      <div className="flex items-center">
        <span className="text-red-600 font-black text-2xl tracking-tight cursor-pointer hover:text-red-500 transition-colors">
          <Link to="/">CINEVERSE</Link>
        </span>
      </div>

      <ul className="flex space-x-8 mx-auto">
        <li>
          <NavItem to="/">Home</NavItem>
        </li>
        <li>
          <NavItem to="/movies">Movies</NavItem>
        </li>
        <li>
          <NavItem to="/my-list">My List</NavItem>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={searchRef}>
          {!showSearch ? (
            <button
              onClick={toggleSearch}
              className="hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-full"
            >
              <Search size={20} />
            </button>
          ) : (
            <div className="flex items-center">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies..."
                  value={query}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchSubmit}
                  className="pl-10 pr-10 py-2 rounded-full bg-black bg-opacity-80 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 w-80 text-white placeholder-gray-400"
                />
                <button
                  onClick={toggleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
          >
            <UserAvatar user={user} size={40} />
            <span className="font-semibold">{user?.name || 'User'}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
            />
          </button>
          {showProfile && (
            <div
              ref={profileRef}
              className="absolute right-0 top-12 bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl z-50"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <UserAvatar user={user} size={40} />
                  <div>
                    <p className="font-semibold">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-400">{user?.role}</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <NavLink
                  to="/account"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">Account</span>
                </NavLink>
                <NavLink
                  to="/help"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <HelpCircle size={16} />
                  <span className="text-sm">Help Center</span>
                </NavLink>
              </div>
              <div className="border-t border-gray-700 py-2">
                <Modal.Open opens="logout-modal">
                  <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left">
                    <LogOut size={16} />
                    <span className="text-sm">Sign out</span>
                  </button>
                </Modal.Open>
                <Modal.Window name="logout-modal">
                  <LogoutConfirm
                    message="You'll need to sign in again to access your account and continue watching."
                    heading="Sign Out?"
                    button="Sign Out"
                    onConfirm={() => {
                      handleLogout();
                      setShowProfile(false);
                    }}
                    onCloseModal={() => setShowProfile(false)}
                  />
                </Modal.Window>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
