import { Menu, Search, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '../../ui/UserAvatar';

const NavbarHeader = ({
  isScrolled,
  onMenuClick,
  onSearchClick,
  user,
  onProfileClick,
  isProfileOpen,
}) => {
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith('/account');
  const navigate = useNavigate();

  if (isAccountPage) {
    return (
      <>
        <nav className="fixed z-50 w-full bg-black/90 backdrop-blur-md">
          <div className="px-4 py-3 flex justify-between items-center">
            <Link
              to="/"
              className="text-red-600 font-black text-xl hover:text-red-500 transition-colors"
            >
              CINEVERSE
            </Link>
            <button
              onClick={() => {
                onProfileClick({ stopPropagation: () => {} });
              }}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
          <div className="border-t border-gray-800">
            <div className="px-4 py-2">
              <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white transition-colors flex items-center text-sm"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="mr-1" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </nav>
        <div className="h-24"></div>
      </>
    );
  }
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
          <button
            onClick={onSearchClick}
            className="hover:text-gray-300 p-2 hover:bg-gray-800 rounded-full"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

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
