import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Play,
  X,
  Menu,
  Film,
  List,
  Home,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';
import { useToast } from '@/context/ToastContext';
import LogoutConfirm from '../Password/LogoutConfirm';
import Modal, { ModalContext } from '../Modals/Modal';
import { logout } from '../../redux/slice/userSlice';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { searchMovies } from '../../api/movies';
import { useDebounce } from '../../hooks/useDebounce';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/movies', label: 'Movies', icon: Film },
  { path: '/my-list', label: 'My List', icon: List },
];
const PROFILE_MENU_ITEMS = [{ path: '/account', label: 'Account', icon: User }];
function NavBar() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const user = useSelector((state) => state.user?.user);
  const isMovieDetailPage = location.pathname.startsWith('/movie/');
  const isSearchPage = location.pathname === '/search';
  const isAccountPage = location.pathname === '/account';
  const hideSearchBar = isSearchPage || isMovieDetailPage || isAccountPage;

  const debouncedQuery = useDebounce(query, 300);
  const token = useSelector((state) => state.user?.token);
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery, token),
    enabled: !!token && debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    if (!user) navigate('/auth/login');
  }, [user, navigate]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (user && user._id && user._id !== storedUserId) {
      queryClient.clear();
      dispatch(logout());
      showToast({
        message: 'Session conflict detected. Logged out.',
        type: 'error',
      });
    }
  }, [user, dispatch, showToast, queryClient]);

  useClickOutside(profileRef, () => setShowProfile(false));
  useClickOutside(searchRef, () => setShowDropdown(false));
  useClickOutside(mobileMenuRef, () => setShowMobileMenu(false));

  const { close } = useContext(ModalContext);

  const handleCloseSearchModal = useCallback(() => {
    setShowSearchModal(false);
    setShowDropdown(false);
    setQuery('');

    queryClient.removeQueries({ queryKey: ['search'] });
  }, [queryClient]);

  const handleLogout = useCallback(() => {
    close();
    setShowSearchModal(false);
    setShowDropdown(false);
    setShowMobileMenu(false);
    setShowProfile(false);
    setQuery('');

    dispatch(logout());
    showToast({ message: 'Signed out successfully', type: 'success' });
    queryClient.clear();

    queryClient.removeQueries({ queryKey: ['search'] });

    navigate('/auth/login');
    navigate('/auth/login');
  }, [dispatch, navigate, queryClient, showToast, close]);

  const handleProfileClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfile((prev) => !prev);
    setShowMobileMenu(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.length > 0);
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setQuery('');
        setShowDropdown(false);
        setShowSearchModal(false);
      }
    },
    [query, navigate]
  );

  const activeClass = useCallback(
    (isActive) =>
      isActive
        ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
        : 'text-gray-300 hover:text-white transition-colors duration-200',
    []
  );
  const NavItem = ({ to, children, icon: Icon, onClick }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 ${activeClass(isActive)}`
      }
      onClick={onClick}
    >
      {Icon && <Icon size={18} className="md:hidden" />}
      {children}
    </NavLink>
  );
  const SearchResult = ({ movie, onClick }) => (
    <Link
      to={`/movie/${movie.slug}`}
      onClick={onClick}
      className="flex items-center p-3 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group border-b border-gray-700 last:border-b-0"
    >
      <div className="flex-shrink-0 w-14 h-20 bg-gray-800 rounded overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
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
      <div className="ml-4 flex-1 min-w-0">
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
  );
  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || showMobileMenu
      ? 'bg-black/95 backdrop-blur-md shadow-lg'
      : 'bg-gradient-to-b from-black/80 to-transparent'
  } ${isAccountPage ? 'border-b border-gray-800' : ''} h-20`;
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={navClasses}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full h-20 px-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-red-600 font-black text-xl md:text-2xl tracking-tight hover:text-red-500 transition-colors"
              aria-label="Cineverse Home"
            >
              CINEVERSE
            </Link>
            <button
              className="md:hidden ml-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {!isAccountPage && (
            <ul className="hidden md:flex space-x-8 mx-auto">
              {NAV_ITEMS.map(({ path, label }) => (
                <li key={path}>
                  <NavItem to={path}>{label}</NavItem>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center space-x-2 md:space-x-4">
            {isAccountPage ? (
              <div className="flex items-center">
                <Modal.Open opens="logout">
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mr-4 whitespace-nowrap h-10 shrink-0">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </Modal.Open>
              </div>
            ) : (
              <>
                {!hideSearchBar && (
                  <div>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                      aria-label="Open search"
                    >
                      <Search
                        size={20}
                        className="text-gray-400 hover:text-white"
                      />
                    </button>
                  </div>
                )}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-1 md:space-x-2 hover:bg-gray-800 rounded-lg p-1.5 md:p-2 transition-all duration-200 group"
                    aria-expanded={showProfile}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <UserAvatar
                      user={user}
                      size={32}
                      className="md:w-10 md:h-10"
                    />
                    <span className="hidden md:inline font-medium">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showProfile && (
                    <div
                      className="absolute right-0 top-12 bg-black/95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl animate-fadeIn"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <UserAvatar user={user} size={40} />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {PROFILE_MENU_ITEMS.map(
                          ({ path, label, icon: Icon }) => (
                            <NavLink
                              key={path}
                              to={path}
                              onClick={() => setShowProfile(false)}
                              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors group"
                              role="menuitem"
                            >
                              <Icon
                                size={16}
                                className="text-gray-400 group-hover:text-red-500 transition-colors"
                              />
                              <span className="text-sm">{label}</span>
                            </NavLink>
                          )
                        )}
                      </div>

                      <div className="border-t border-gray-700 py-2">
                        <Modal.Open opens="logout">
                          <button
                            onClick={() => setShowProfile(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left group"
                            role="menuitem"
                          >
                            <LogOut
                              size={16}
                              className="text-gray-400 group-hover:text-red-500 transition-colors"
                            />
                            <span className="text-sm">Sign out</span>
                          </button>
                        </Modal.Open>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {showMobileMenu && !isAccountPage && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-700 animate-slideDown"
          >
            <ul className="py-4 px-4 space-y-2">
              {NAV_ITEMS.map(({ path, label, icon }) => (
                <li key={path}>
                  <NavItem
                    to={path}
                    icon={icon}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {label}
                  </NavItem>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {isAccountPage && (
        <div className="fixed top-20 left-0 right-0 bg-black z-40 py-2">
          <div className="px-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm pl-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      )}

      {showSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-start pt-24 px-4">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  autoFocus
                  placeholder="Search movies..."
                  className="w-full px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </form>
              <button
                onClick={handleCloseSearchModal}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto bg-black/80 rounded-xl">
              {isSearching ? (
                <div className="p-6 text-center text-white">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <SearchResult
                    key={movie._id}
                    movie={movie}
                    onClick={handleCloseSearchModal}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  No results for "{query}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal.Window name="logout">
        <LogoutConfirm
          message="You'll need to sign in again to access your account and continue watching."
          heading="Sign Out?"
          button="Sign Out"
          onConfirm={() => {
            handleLogout();
          }}
        />
      </Modal.Window>
    </div>
  );
}

export default React.memo(NavBar);
