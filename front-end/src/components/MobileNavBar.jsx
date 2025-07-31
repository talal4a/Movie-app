import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Gift,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open || showProfile ? 'hidden' : 'auto';
  }, [open, showProfile]);
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
          <span className="text-red-600 font-black text-2xl tracking-tight cursor-pointer hover:text-red-500 transition-colors">
            CINEVERSE
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <button className="hover:text-gray-300 p-2 hover:bg-gray-800 rounded-full">
            <Search size={20} />
          </button>
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
            <div className="absolute right-0 top-14 bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl z-50">
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
                <Link
                  to="/account"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800"
                >
                  <User size={16} />
                  <span className="text-sm">Account</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800"
                >
                  <HelpCircle size={16} />
                  <span className="text-sm">Help Center</span>
                </Link>
              </div>
              <div className="border-t border-gray-700 py-2">
                <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 w-full text-left">
                  <LogOut size={16} />
                  <span className="text-sm">Sign out</span>
                </button>
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
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/mylist" onClick={() => setOpen(false)}>
            My List
          </Link>
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
