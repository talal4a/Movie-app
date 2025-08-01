import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signup } from './../api/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/slice/userSlice';
import { useToast } from '@/context/ToastContext';
export default function SignupLayout() {
 const { showToast } = useToast();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(setCredentials({ token: data.token, user: data.user }));
      showToast({ message: 'Sign in successfully', type: 'success' });
      navigate('/');
    },
    onError: () => {
      showToast({ message: 'Sign in failed', type: 'error' });
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
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white font-sans">
      <img
        src="/background.jpg"
        alt="Netflix Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <SignUpForm
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        mutation={mutation}
      />
    </div>
  );
}
