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
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signup } from './../api/auth';
export default function Signup() {
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
      navigate('/');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Signup failed');
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
      >
        <Card className="bg-transparent text-white shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                placeholder="Enter your password"
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
                placeholder="Confirm your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-sm text-zinc-400 text-center">
              <span>Already have account? </span>
              <Link
                to="/auth/login"
                className="text-white hover:underline font-medium"
              >
                Login now
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
