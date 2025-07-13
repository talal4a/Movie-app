import { NavLink } from 'react-router-dom';
export default function NavBar() {
  return (
    <nav className="fixed z-50 flex items-center bg-black bg-opacity-70 px-6 py-3 backdrop-blur-sm text-white w-full">
      <span className="text-red-600 font-bold text-2xl">Cineverse</span>
      <ul className="flex space-x-10 mx-auto">
        <li>
          <NavLink to="/" className="hover:text-gray-300 transition">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/tv-shows" className="hover:text-gray-300 transition">
            Movies
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className="hover:text-gray-300 transition">
            My List
          </NavLink>
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        <NavLink to="/account">
          <div className="w-8 h-8 bg-gray-400 rounded-full hover:ring-2 ring-white transition" />
        </NavLink>
      </div>
    </nav>
  );
}
