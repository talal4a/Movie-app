import { Menu, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
const NavbarHeader = ({
  isScrolled,
  onMenuClick,
  onSearchClick,
  showSearchButton = true,
  user,
  onProfileClick,
  isProfileOpen,
}) => {
  return (
    <nav
      className={`fixed z-50 flex items-center px-0 py-3 text-white w-full transition-all duration-300  ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md py-2'
          : 'bg-gradient-to-b from-black via-black/50 to-transparent'
      }`}
    >
      <div className="w-full px-3 flex items-center">
        <button
          onClick={onMenuClick}
          className="text-white hover:bg-gray-800 p-2 rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="mr-2">
          <h1 className="text-2xl font-bold text-red-600">CINEVERSE</h1>
        </Link>

        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          {showSearchButton && (
            <button
              onClick={onSearchClick}
              className="hover:text-gray-300 p-2 hover:bg-gray-800 rounded-full"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          <button
            onClick={onProfileClick}
            className="flex items-center hover:bg-gray-800 p-1 rounded-full transition-colors group"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <UserAvatar user={user} size={32} />
            <ChevronDown
              size={16}
              className={`ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHeader;
