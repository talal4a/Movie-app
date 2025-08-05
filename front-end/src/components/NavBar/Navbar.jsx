import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Play,
  X,
  Menu,
  Film,
  List,
  Home,
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
import { useDebounce } from '../../hooks/useDebounce';

// Custom hook for handling clicks outside
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

// Navigation items configuration
const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/movies', label: 'Movies', icon: Film },
  { path: '/my-list', label: 'My List', icon: List },
];

// Profile menu items configuration
const PROFILE_MENU_ITEMS = [
  { path: '/account', label: 'Account', icon: User },
  { path: '/help', label: 'Help Center', icon: HelpCircle },
];

function NavBar() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // State management
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Refs
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Selectors
  const user = useSelector((state) => state.user?.user);
  const isSearchPage = location.pathname === '/search';

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Search query
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Session conflict detection
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (user && user._id && user._id !== storedUserId) {
      dispatch(logout());
      showToast({
        message: 'Session conflict detected. Logged out.',
        type: 'error',
      });
    }
  }, [user, dispatch, showToast]);

  // Click outside handlers
  useClickOutside(profileRef, () => setShowProfile(false));
  useClickOutside(searchRef, () => setShowDropdown(false));
  useClickOutside(mobileMenuRef, () => setShowMobileMenu(false));

  // Callbacks
  const handleLogout = useCallback(() => {
    dispatch(logout());
    showToast({ message: 'Signed out successfully', type: 'success' });
    queryClient.clear();
    navigate('/auth/login');
  }, [dispatch, navigate, queryClient, showToast]);

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
      }
    },
    [query, navigate]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setShowDropdown(false);
  }, []);

  // Memoized values
  const activeClass = useCallback(
    (isActive) =>
      isActive
        ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
        : 'text-gray-300 hover:text-white transition-colors duration-200',
    []
  );

  const navClasses = useMemo(
    () =>
      `fixed z-50 flex items-center px-4 md:px-6 py-3 text-white w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-b from-black via-black/50 to-transparent'
      }`,
    [isScrolled]
  );

  // Components
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
      className="flex items-center p-3 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
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

  return (
    <Modal>
      <nav
        className={navClasses}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-red-600 font-black text-xl md:text-2xl tracking-tight hover:text-red-500 transition-colors"
              aria-label="Cineverse Home"
            >
              CINEVERSE
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden ml-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8 mx-auto">
            {NAV_ITEMS.map(({ path, label }) => (
              <li key={path}>
                <NavItem to={path}>{label}</NavItem>
              </li>
            ))}
          </ul>

          {/* Search and Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            {!isSearchPage && (
              <div
                ref={searchRef}
                className="relative w-full max-w-xs md:max-w-md"
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      searchFocused ? 'text-red-500' : 'text-gray-400'
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      setSearchFocused(true);
                      setShowDropdown(query.length > 0);
                    }}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search movies..."
                    className="w-full pl-10 pr-10 py-2 rounded-full bg-zinc-900/80 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-zinc-900 transition-all"
                    aria-label="Search movies"
                    aria-expanded={showDropdown}
                    aria-controls="search-results"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>

                {/* Search Results Dropdown */}
                {showDropdown && query && (
                  <div
                    id="search-results"
                    className="absolute z-50 mt-2 left-0 right-0 bg-black/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn"
                  >
                    <div className="max-h-[60vh] overflow-y-auto thin-scrollbar">
                      {isSearching ? (
                        <div className="p-6 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-red-500"></div>
                          <p className="mt-2 text-gray-300 font-medium">
                            Searching...
                          </p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                          <div className="p-2">
                            {searchResults.slice(0, 8).map((movie) => (
                              <SearchResult
                                key={movie._id}
                                movie={movie}
                                onClick={() => {
                                  setShowDropdown(false);
                                  setQuery('');
                                }}
                              />
                            ))}
                          </div>
                          {searchResults.length > 8 && (
                            <div className="p-3 text-center">
                              <Link
                                to={`/search?q=${encodeURIComponent(query)}`}
                                className="text-sm text-red-500 hover:text-red-400 font-medium"
                                onClick={() => {
                                  setShowDropdown(false);
                                  setQuery('');
                                }}
                              >
                                View all {searchResults.length} results
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-gray-300 text-sm font-medium">
                            No results found for "{query}"
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Try different keywords
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-1 md:space-x-2 hover:bg-gray-800 rounded-lg p-1.5 md:p-2 transition-all duration-200 group"
                aria-expanded={showProfile}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <UserAvatar user={user} size={32} className="md:w-10 md:h-10" />
                <span className="hidden md:inline font-medium group-hover:text-red-500 transition-colors">
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
                    {PROFILE_MENU_ITEMS.map(({ path, label, icon: Icon }) => (
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
                    ))}
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
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
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

      {/* Logout Modal */}
      <Modal.Window name="logout">
        <LogoutConfirm
          message="You'll need to sign in again to access your account and continue watching."
          heading="Sign Out?"
          button="Sign Out"
          onConfirm={handleLogout}
          onCloseModal={() => {}}
        />
      </Modal.Window>
    </Modal>
  );
}

export default React.memo(NavBar);
