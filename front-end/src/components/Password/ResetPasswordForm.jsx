import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
export default function ResetPasswordForm({
  handleSubmit,
  formData,
  handleChange,
  mutation,
  message,
}) {
  return (
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
            <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
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
  );
}
