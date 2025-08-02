import { Menu, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import ProfileMenu from './ProfileMenu';

const NavbarHeader = ({ isScrolled, onMenuClick, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === '/search';

  return (
    <nav
      className={`fixed z-50 flex items-center justify-between px-4 py-3 text-white w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-black bg-opacity-95 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-b from-black via-black/50 to-transparent'
      }`}
    >
      <button onClick={onMenuClick}>
        <Menu size={28} />
      </button>
      
      <div className="flex-grow text-center">
        <Link to="/">
          <span className="text-red-600 font-black text-2xl tracking-tight hover:text-red-500">
            CINEVERSE
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 relative">
        {!isSearchPage && (
          <button
            onClick={() => navigate('/search')}
            className="hover:text-gray-300 p-2 hover:bg-gray-800 rounded-full"
          >
            <Search size={20} />
          </button>
        )}
        <ProfileMenu user={user} />
      </div>
    </nav>
  );
};

export default NavbarHeader;
