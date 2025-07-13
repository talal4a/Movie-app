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
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
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
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
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
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
