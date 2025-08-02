import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const MobileSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/my-list", label: "My List" },
  ];
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-xl font-bold text-red-600">Menu</span>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 space-y-4 text-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => 
                isActive ? 'text-red-500' : 'hover:text-gray-300'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileSidebar;
