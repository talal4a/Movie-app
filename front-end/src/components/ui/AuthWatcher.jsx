import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axioInstance';
export default function AuthWatcher() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    const checkUserExistence = async () => {
      try {
        const response = await axiosInstance.get(`/users/me`);
        if (response.data.status !== 'success' || !response.data.data?._id) {
          dispatch(logout());
          navigate('/auth/signup');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        dispatch(logout());
        navigate('/auth/signup');
      }
    };
    const interval = setInterval(checkUserExistence, 10000);
    return () => clearInterval(interval);
  }, [user, dispatch, navigate]);
  return null;
}
