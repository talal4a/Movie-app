import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/slice/userSlice';
import { useToast } from '@/context/ToastContext';
import LoginForm from '@/components/Password/LoginForm';
export default function Login() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      localStorage.setItem('token', data.token);
      showToast({ message: 'Logged in successfully', type: 'success' });
      navigate('/');
    },
    onError: () => {
      showToast({ message: 'Logged in failed', type: 'error' });
    },
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  return (
    <div className="relative min-h-screen bg-black text-white">
      <img
        src="/background.jpg"
        alt="Netflix Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <LoginForm
          handleSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          mutation={mutation}
        />
      </div>
    </div>
  );
}
