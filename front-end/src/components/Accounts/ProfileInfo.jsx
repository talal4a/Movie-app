import { Camera, User, ShieldCheck } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
export default function ProfileInfo({
  user,
  isEditing,
  setIsEditing,
  handleProfilePhotoChange,
}) {
  return (
    <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2">
          <User className="text-red-500" size={22} />
          Profile Information
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 rounded-md"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-6">
        <div className="relative">
          <UserAvatar user={user} size={80} />
          {isEditing && (
            <>
              <button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full border-2 border-black flex items-center justify-center"
                onClick={() => document.getElementById('photo-upload').click()}
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePhotoChange}
              />
            </>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold mb-1">
            {user?.name || 'User'}
          </h3>
          <p className="text-gray-400 text-sm mb-1">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-green-400">
            <ShieldCheck size={16} /> <span>Verified Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
