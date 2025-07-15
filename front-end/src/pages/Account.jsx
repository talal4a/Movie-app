import { useSelector } from 'react-redux';
import { Mail, ShieldCheck } from 'lucide-react';
export default function Account() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">
          Account Settings
        </h1>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-semibold mb-2">Account Info</h3>
          <div className="flex items-center space-x-3 text-gray-300">
            <Mail size={18} />
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
