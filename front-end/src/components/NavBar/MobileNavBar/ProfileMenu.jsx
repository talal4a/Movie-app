import { useEffect, useRef } from 'react';
import { HelpCircle, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import UserAvatar from '../../ui/UserAvatar';
import Modal from '../../Modals/Modal';
import LogoutConfirm from '../../Password/LogoutConfirm';

const ProfileMenu = ({ user, onLogout, onClose }) => {
  const menuRef = useRef(null);

  // Handle clicks outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if clicking on the profile button or the menu itself
      const profileButton = document.querySelector(
        '[aria-expanded][aria-haspopup="true"]'
      );
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !profileButton?.contains(event.target)
      ) {
        onClose?.();
      }
    }

    // Add when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Stop propagation on menu clicks to prevent immediate closing
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  const handleMenuItemClick = () => {
    onClose?.();
  };

  return (
    <div
      ref={menuRef}
      onClick={handleMenuClick}
      className="bg-black bg-opacity-95 backdrop-blur-xl border border-gray-700 rounded-lg w-64 shadow-2xl overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size={40} />
          <div>
            <p className="font-semibold">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-400">{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>

      <div className="py-2">
        <NavLink
          to="/account"
          onClick={handleMenuItemClick}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800' : ''}`
          }
        >
          <User size={16} />
          <span className="text-sm">Account</span>
        </NavLink>
        <NavLink
          to="/help"
          onClick={handleMenuItemClick}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800' : ''}`
          }
        >
          <HelpCircle size={16} />
          <span className="text-sm">Help Center</span>
        </NavLink>
      </div>

      <div className="border-t border-gray-700 py-2">
        <Modal.Open opens="logout-modal">
          <button
            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left"
            onClick={handleMenuItemClick}
          >
            <LogOut size={16} />
            <span className="text-sm">Sign out</span>
          </button>
        </Modal.Open>
        <Modal.Window name="logout-modal">
          <LogoutConfirm
            message="You'll need to sign in again to access your account and continue watching."
            heading="Sign Out?"
            button="Sign Out"
            onConfirm={onLogout}
            onCloseModal={onClose}
          />
        </Modal.Window>
      </div>
    </div>
  );
};

export default ProfileMenu;
