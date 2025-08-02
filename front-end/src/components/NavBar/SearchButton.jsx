import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchButton = ({ isSearchPage }) => {
  const navigate = useNavigate();

  if (isSearchPage) return null;

  return (
    <button
      onClick={() => navigate('/search')}
      className="hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-full"
    >
      <Search size={20} />
    </button>
  );
};

export default SearchButton;
