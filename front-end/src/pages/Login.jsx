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
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/slice/userSlice';
import { useToast } from '@/context/ToastContext';
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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
        >
          <Card className="bg-transparent text-white shadow-md border-none">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Log In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-sm text-zinc-400 text-center">
                <span>New to Cineverse? </span>
                <Link
                  to="/auth/signup"
                  className="text-white hover:underline font-medium"
                >
                  Sign up now
                </Link>
              </div>
              <div className="text-xs text-zinc-500 text-center pt-2">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
