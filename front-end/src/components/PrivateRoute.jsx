import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/auth/login" replace />;
};
export default PrivateRoute;
