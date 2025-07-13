import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GuestRoute = ({ children }) => {
  const [isGuest, setIsGuest] = useState(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsGuest(true);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setIsGuest(true);
        } else {
          setIsGuest(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsGuest(true);
      }
    };
    checkToken();
  }, []);

  if (isGuest === null) return <div>Loading...</div>;

  return isGuest ? children : <Navigate to="/" replace />;
};

export default GuestRoute;
