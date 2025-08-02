import { NavLink } from 'react-router-dom';
const NavItem = ({ to, children }) => {
  const activeClass = (isActive) =>
    isActive
      ? 'text-white font-semibold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-red-600'
      : 'text-gray-300 hover:text-white transition-colors duration-200';
  return (
    <NavLink to={to} className={({ isActive }) => activeClass(isActive)}>
      {children}
    </NavLink>
  );
};
export default NavItem;
