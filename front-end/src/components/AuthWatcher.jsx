import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '@/api/axioInstance';
export default function AuthWatcher() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    const checkUserExistence = async () => {
      try {
        const response = await axiosInstance.get(`/user/${user._id}`);
        if (!response.data || Object.keys(response.data).length === 0) {
          dispatch(logout());
          navigate('/auth/signup');
        }
      } catch (error) {
        console.error('Error while checking user existence:', error.message);
        if (error.response?.status === 404) {
          dispatch(logout());
          navigate('/auth/signup');
        }
      }
    };
    const interval = setInterval(checkUserExistence, 10000);
    return () => clearInterval(interval);
  }, [user, dispatch, navigate]);
  return null;
}
