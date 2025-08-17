import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateEmail } from '@/utils/validations';
import Spinner from '@/components/ui/Spinner';
import MiniSpinner from '@/components/ui/MiniSpinner';

export default function LoginForm({
  handleSubmit,
  formData,
  handleChange,
  mutation,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = {};

      if (touched.email) {
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
      }

      if (touched.password) {
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
      }

      setErrors(newErrors);
    }
  }, [formData, touched]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    const allTouched = {
      email: true,
      password: true,
    };
    setTouched(allTouched);

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleLocalSubmit}
      className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
      noValidate
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
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
              autoComplete="username"
            />
            <ErrorMessage message={errors.email} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-zinc-400 hover:text-white hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.password ? 'border-red-500' : ''
              }`}
              required
              autoComplete="current-password"
            />
            <ErrorMessage message={errors.password} />
          </div>

          <Button
            type="submit"
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold ${
              mutation.isPending ||
              Object.keys(errors).length > 0 || 
              !formData.email || 
              !formData.password
                ? 'cursor-not-allowed'
                : ''
            }`}
            disabled={
              mutation.isPending || 
              Object.keys(errors).length > 0 || 
              !formData.email || 
              !formData.password
            }
          >
            {mutation.isPending ? (
              <>
                <MiniSpinner size="sm" />
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>
          <div className="text-sm text-zinc-400 text-center pt-2">
            <span>New to Cineverse? </span>
            <Link
              to="/auth/signup"
              className="text-white hover:underline font-medium"
            >
              Sign up now
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
