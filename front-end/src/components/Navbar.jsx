import { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Gift,
  HelpCircle,
} from 'lucide-react';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeClass = (isActive) =>
    isActive
      ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
      : 'text-gray-300 hover:text-white transition-colors duration-200';

  const NavItem = ({ to, children, isActive = false }) => (
    <a
      href={to}
      className={activeClass(isActive)}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </a>
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
          CINEVERSE
        </span>
      </div>
      <ul className="flex space-x-8 mx-auto">
        <li>
          <NavItem to="/" isActive={true}>
            Home
          </NavItem>
        </li>
        <li>
          <NavItem to="/movies">Movies</NavItem>
        </li>
        <li>
          <NavItem to="/my-list">My List</NavItem>
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-full"
          >
            <Search size={20} />
          </button>

          {showSearch && (
            <div className="absolute right-0 top-12 bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 w-80 shadow-2xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  autoFocus
                />
              </div>
              {searchQuery && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-gray-400 mb-2">
                    Recent searches
                  </div>
                  <div className="text-sm text-gray-300 hover:text-white cursor-pointer py-1">
                    Stranger Things
                  </div>
                  <div className="text-sm text-gray-300 hover:text-white cursor-pointer py-1">
                    The Crown
                  </div>
                  <div className="text-sm text-gray-300 hover:text-white cursor-pointer py-1">
                    Dark
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-sm font-medium">Talal</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    T
                  </div>
                  <div>
                    <p className="font-semibold">Talal</p>
                    <p className="text-sm text-gray-400">Premium Member</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <a
                  href="/account"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">Account</span>
                </a>
                <a
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </a>
                <a
                  href="/help"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <HelpCircle size={16} />
                  <span className="text-sm">Help Center</span>
                </a>
                <div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer">
                  <Gift size={16} />
                  <span className="text-sm">Gift Cards</span>
                </div>
              </div>

              <div className="border-t border-gray-700 py-2">
                <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left">
                  <LogOut size={16} />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
