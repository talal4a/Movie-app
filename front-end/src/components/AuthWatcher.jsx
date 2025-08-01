import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function AuthWatcher() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserExistence = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`/api/user/${user._id}`);
        if (!response.data.exists) {
          dispatch(logout());
          navigate('/auth/signup');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        dispatch(logout());
        navigate('/auth/signup');
      }
    };
    const interval = setInterval(checkUserExistence, 10000);
    return () => clearInterval(interval);
  }, [user, dispatch, navigate]);

  return null;
}
