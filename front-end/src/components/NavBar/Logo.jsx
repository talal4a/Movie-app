import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="flex items-center">
    <span className="text-red-600 font-black text-2xl tracking-tight cursor-pointer hover:text-red-500 transition-colors">
      <Link to="/">CINEVERSE</Link>
    </span>
  </div>
);

export default Logo;
