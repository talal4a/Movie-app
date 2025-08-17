import { useState, useEffect } from 'react';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validatePassword, getPasswordStrength } from '@/utils/validations';
import MiniSpinner from '@/components/ui/MiniSpinner';
export default function ResetPasswordForm({
  handleSubmit,
  formData,
  handleChange,
  mutation,
  message,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    }

    if (Object.keys(touched).length > 0) {
      const newErrors = {};

      if (touched.password) {
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!validatePassword(formData.password)) {
          newErrors.password =
            'Password must contain at least one uppercase, one lowercase, one number, and one special character';
        }
      }

      if (touched.confirmPassword) {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
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
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase, one lowercase, one number, and one special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    >
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
              onBlur={() => handleBlur('password')}
              className={`bg-gray-900/50 border-gray-700 text-white focus-visible:ring-red-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <div className="mt-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Password Strength:</span>
                <span>
                  {passwordStrength < 2
                    ? 'Weak'
                    : passwordStrength < 4
                      ? 'Good'
                      : 'Strong'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    passwordStrength < 2
                      ? 'bg-red-500'
                      : passwordStrength < 4
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p>Password must contain:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li
                    className={
                      formData.password?.length >= 8 ? 'text-green-400' : ''
                    }
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password) ? 'text-green-400' : ''
                    }
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.password) ? 'text-green-400' : ''
                    }
                  >
                    One lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.password) ? 'text-green-400' : ''
                    }
                  >
                    One number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(formData.password)
                        ? 'text-green-400'
                        : ''
                    }
                  >
                    One special character
                  </li>
                </ul>
              </div>
            </div>
            <ErrorMessage message={errors.password} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`bg-gray-900/50 border-gray-700 text-white focus-visible:ring-red-500 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage message={errors.confirmPassword} />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            disabled={
              !formData.password ||
              !formData.confirmPassword ||
              Object.keys(errors).length > 0 ||
              mutation.isPending
            }
            style={{
              cursor:
                !formData.password ||
                !formData.confirmPassword ||
                Object.keys(errors).length > 0 ||
                mutation.isPending
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {mutation.isPending ? (
              <div className="flex items-center justify-center">
                <MiniSpinner className="h-5 w-5 mr-2" />
                Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </Button>
          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.startsWith('✅') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
