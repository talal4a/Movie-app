import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/api/auth';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '@radix-ui/react-label';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateEmail } from '@/utils/validations';
import MiniSpinner from '@/components/ui/MiniSpinner';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) {
      const newErrors = {};

      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      setErrors(newErrors);
    }
  }, [email, touched]);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setMessage('✅ Reset link sent to your email!');
    },
    onError: (error) => {
      setMessage(
        error.response?.data?.message ||
          '❌ Something went wrong. Please try again later.'
      );
    },
  });

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched(true);

    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      mutation.mutate({ email });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
      noValidate
    >
      <div className="space-y-5 p-6">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            className={`bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 ${
              errors.email ? 'border-red-500' : ''
            }`}
            placeholder="Enter your email"
            required
          />
          <ErrorMessage message={errors.email} />
        </div>

        <Button
          type="submit"
          className={`w-full font-semibold bg-red-600 hover:bg-red-700 text-white ${
            mutation.isPending || Object.keys(errors).length > 0 || !email
              ? 'cursor-not-allowed'
              : ''
          }`}
          disabled={
            mutation.isPending || Object.keys(errors).length > 0 || !email
          }
        >
          {mutation.isPending ? (
            <>
              (<MiniSpinner />
              Sending...)
            </>
          ) : (
            'Send Reset Link'
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
      </div>
    </form>
  );
}
