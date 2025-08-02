import { useState, useRef } from 'react';
import { ChevronDown, User, LogOut, HelpCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import useOutsideClick from '@/hooks/useOutsideClick';
import { logout } from '@/redux/slice/userSlice';
import { useToast } from '@/context/ToastContext';

const ProfileMenu = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useOutsideClick({
    ref: profileRef,
    handler: () => setShowProfile(false),
  });

  const handleLogout = () => {
    dispatch(logout());
    showToast({ message: 'Signed out successfully', type: 'success' });
    navigate('/auth/login');
  };

  const handleNavClick = () => {
    setShowProfile(false);
  };

  return (
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
              onClick={handleNavClick}
              className={({ isActive }) => `flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors block ${isActive ? 'bg-gray-800' : ''}`}
            >
              <User size={16} />
              <span className="text-sm">Account</span>
            </NavLink>
            <NavLink
              to="/help"
              onClick={handleNavClick}
              className={({ isActive }) => `flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors block ${isActive ? 'bg-gray-800' : ''}`}
            >
              <HelpCircle size={16} />
              <span className="text-sm">Help Center</span>
            </NavLink>
          </div>
          <div className="border-t border-gray-700 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left"
            >
              <LogOut size={16} />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
