import { useEffect, useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slice/userSlice';
import UserAvatar from './UserAvatar';
import { useToast } from '@/context/ToastContext';
import LogoutConfirm from './LogoutConfirm';
import Modal from './Modals/Modal';
import useOutsideClick from '@/hooks/useOutsideClick';
export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const profileRef = useOutsideClick({ handler: () => setShowProfile(false) });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open || showProfile ? 'hidden' : 'auto';
  }, [open, showProfile]);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
    showToast({ message: 'Logout successfully', type: 'success' });
  };
  return (
    <>
      <nav
        className={`fixed z-50 flex items-center justify-between px-4 py-3 text-white w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-black bg-opacity-95 backdrop-blur-xl shadow-lg'
            : 'bg-gradient-to-b from-black via-black/50 to-transparent'
        }`}
      >
        <button onClick={() => setOpen(true)}>
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
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg p-2 transition-colors"
          >
            <UserAvatar user={user} size={32} />
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                showProfile ? 'rotate-180' : ''
              }`}
            />
          </button>
          {showProfile && (
            <div
              ref={profileRef}
              className="absolute right-0 top-14 bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl z-50"
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
      </nav>
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-xl font-bold text-red-600">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 space-y-4 text-lg">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/movies" onClick={() => setOpen(false)}>
            Movies
          </NavLink>
          <NavLink to="/my-list" onClick={() => setOpen(false)}>
            My List
          </NavLink>
        </div>
      </div>
      {(open || showProfile) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setOpen(false);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
}
