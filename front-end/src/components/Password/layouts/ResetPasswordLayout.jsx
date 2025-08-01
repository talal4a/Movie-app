import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/auth';
import ResetPasswordForm from '@/components/Password/ResetPasswordForm';
export default function ResetPasswordLayout() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: () => resetPassword({ token, ...formData }),
    onSuccess: () => {
      setMessage('✅ Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 2000);
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
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white font-sans">
      <img
        src="/background.jpg"
        alt="Netflix Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <ResetPasswordForm
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        mutation={mutation}
        message={message}
      />
    </div>
  );
}
