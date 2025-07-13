import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const GuestRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate, token]);

  return !token ? children : null;
};
export default GuestRoute;
