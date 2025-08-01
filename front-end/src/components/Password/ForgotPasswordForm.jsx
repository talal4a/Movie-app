import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/api/auth';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
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
            className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
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
