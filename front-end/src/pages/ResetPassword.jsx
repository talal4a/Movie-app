import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
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
      <form onSubmit={handleSubmit} className="z-10 w-full max-w-md px-4">
        <Card className="bg-transparent text-white shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-gray-300">
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-gray-300"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
            {message && (
              <p
                className={`text-center text-sm font-medium mt-3 ${
                  message.startsWith('✅') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
