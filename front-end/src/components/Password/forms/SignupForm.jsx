import { useState, useEffect } from 'react';
import { Label } from '@radix-ui/react-label';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateForm, getPasswordStrength } from '@/utils/validations';

export default function SignupForm({ handleSubmit, formData, handleChange, mutation }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validate on form data change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: formErrors } = validateForm(formData);
      setErrors(formErrors);
    }
    
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    }
  }, [formData, touched]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    const allTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);
    
    // Validate form
    const { isValid, errors: formErrors } = validateForm(formData);
    setErrors(formErrors);
    
    // Only submit if there are no errors
    if (isValid) {
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
          <CardTitle className="text-3xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter your full name"
              required
            />
            <ErrorMessage message={errors.name} />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="Enter your email"
              required
            />
            <ErrorMessage message={errors.email} />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.password ? 'border-red-500' : ''
              }`}
              placeholder="Create a password"
              required
            />
            <div className="mt-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Password Strength:</span>
                <span>
                  {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    passwordStrength < 2 ? 'bg-red-500' : 
                    passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p>Password must contain:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li className={formData.password?.length >= 8 ? 'text-green-400' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-400' : ''}>
                    One number
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-400' : ''}>
                    One special character
                  </li>
                </ul>
              </div>
            </div>
            <ErrorMessage message={errors.password} />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              placeholder="Confirm your password"
              required
            />
            <ErrorMessage message={errors.confirmPassword} />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold ${
              Object.keys(errors).length > 0 ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={mutation.isPending || Object.keys(errors).length > 0}
          >
            {mutation.isPending ? 'Creating Account...' : 'Sign Up'}
          </Button>

          {/* Login Link */}
          <div className="text-sm text-zinc-400 text-center pt-2">
            <span>Already have an account? </span>
            <Link
              to="/auth/login"
              className="text-white hover:underline font-medium"
            >
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
