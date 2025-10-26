import { Card, CardHeader, CardTitle } from '../../ui/card';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';

export default function ForgotPasswordLayout() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white font-sans">
      <img
        src="/background.jpg"
        alt="Netflix Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="w-full max-w-md z-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
