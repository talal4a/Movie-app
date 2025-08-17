import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    document.title = 'Page Not Found | Your Movie App';
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 z-0">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-bold text-red-600 mb-4">
            4<span className="text-white">0</span>4
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Lost in the Movie Universe
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Don't worry, let's get you back to the action!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-200 font-semibold rounded"
            >
              Go Back
            </button>
            <Link
              to={isAuthenticated ? '/' : '/auth/login'}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors duration-200 text-center"
            >
              {isAuthenticated ? 'Go to Home' : 'Sign In'}
            </Link>
          </div>
          
          <div className="mt-12 text-gray-400 text-sm">
            <p>Error code: 404</p>
            <p className="mt-2">
              Looking for something specific? Try our{' '}
              <Link to="/search" className="text-red-400 hover:underline">
                search
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
