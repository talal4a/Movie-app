import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function ErrorMessage({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-1 text-red-500 text-xs mt-1 ${className}`}>
      <ExclamationTriangleIcon className="w-3 h-3" />
      <span>{message}</span>
    </div>
  );
}
