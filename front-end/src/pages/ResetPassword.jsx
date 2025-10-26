import { useParams } from 'react-router-dom';
import ResetPasswordLayout from '@/components/Password/layouts/ResetPasswordLayout';

export default function ResetPassword() {
  const { token } = useParams();
  
  if (!token) {
    return <div>Invalid or missing reset token</div>;
  }
  
  return <ResetPasswordLayout />;
}
