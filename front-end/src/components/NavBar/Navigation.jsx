import NavItem from './NavItem';

const Navigation = () => {
  return (
    <ul className="flex space-x-8 mx-auto">
      <li>
        <NavItem to="/">Home</NavItem>
      </li>
      <li>
        <NavItem to="/movies">Movies</NavItem>
      </li>
      <li>
        <NavItem to="/my-list">My List</NavItem>
      </li>
    </ul>
  );
};

export default Navigation;
