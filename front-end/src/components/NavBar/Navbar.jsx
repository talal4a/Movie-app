import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Play,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';
import { useToast } from '@/context/ToastContext';
import LogoutConfirm from '../Password/LogoutConfirm';
import Modal from '../Modals/Modal';
import { logout } from '../../redux/slice/userSlice';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { searchMovies } from '../../api/movies';
function NavBar() {
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMovies(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const profileRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      const profileButton = document.querySelector('[data-profile-button]');
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButton?.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
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
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (user && user._id && user._id !== storedUserId) {
      dispatch(logout());
      showToast({
        message: 'Session conflict detected. Logged out.',
        type: 'error',
      });
    }
  }, [user]);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    showToast({ message: 'Signed out successfully', type: 'success' });
    queryClient.clear();
    navigate('/auth/login');
  };
  const activeClass = (isActive) =>
    isActive
      ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
      : 'text-gray-300 hover:text-white transition-colors duration-200';
  const NavItem = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => activeClass(isActive)}>
      {children}
    </NavLink>
  );
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfile((prev) => !prev);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowProfile(false);
  };
  const handleConfirmLogout = () => {
    handleLogout();
  };

  return (
    <Modal>
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
          {!isSearchPage && (
            <div className="relative flex-1 max-w-md mr-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Search for a movie..."
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-zinc-900 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              {showDropdown && query && (
                <div className="absolute z-50 mt-1 w-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-xl border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden will-change-transform">
                  <div className="max-h-[60vh] overflow-y-auto thin-scrollbar">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-red-500"></div>
                        <p className="mt-2 text-gray-300 font-medium">
                          Searching...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        <div className="p-2">
                          {searchResults.slice(0, 5).map((movie) => (
                            <Link
                              key={movie._id}
                              to={`/movie/${movie.slug}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(false);
                                setQuery('');
                              }}
                              className="flex items-center p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
                            >
                              <div className="flex-shrink-0 w-12 h-16 bg-gray-800 rounded overflow-hidden">
                                {movie.poster ? (
                                  <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-poster.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                    <Play className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors">
                                  {movie.title}
                                </p>
                                {movie.releaseYear && (
                                  <p className="text-xs text-gray-400">
                                    {new Date(movie.releaseYear).getFullYear()}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-300 text-sm font-medium">
                          No results found for "{query}"
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Try different keywords or check the spelling
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
              aria-expanded={showProfile}
              aria-haspopup="true"
              data-profile-button
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
                  <Modal.Open opens="logout">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </Modal.Open>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Modal.Window name="logout">
        <LogoutConfirm
          message="You'll need to sign in again to access your account and continue watching."
          heading="Sign Out?"
          button="Sign Out"
          onConfirm={handleConfirmLogout}
          onCloseModal={() => {}}
        />
      </Modal.Window>
    </Modal>
  );
}
export default React.memo(NavBar);
