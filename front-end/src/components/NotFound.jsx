import { Link } from 'react-router-dom';
const NotFound = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to={isAuthenticated ? '/' : '/auth/login'}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};
export default NotFound;
