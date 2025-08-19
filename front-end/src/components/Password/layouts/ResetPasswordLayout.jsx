import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slice/userSlice';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../../api/auth';
import ResetPasswordForm from "../forms/ResetPasswordForm";
export default function ResetPasswordLayout() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: () => resetPassword({ token, ...formData }),
    onSuccess: () => {
      // Ensure any existing session is cleared so GuestRoute doesn't redirect to home
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch {}
      dispatch(logout());
      setMessage('✅ Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 1500);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || '❌ Reset failed');
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
    mutation.mutate();
  };
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/background.jpg"
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.4) blur(4px)',
            transform: 'scale(1.1)'
          }}
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <ResetPasswordForm
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            mutation={mutation}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
