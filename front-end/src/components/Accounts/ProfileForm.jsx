import { Mail, Save } from 'lucide-react';

export default function ProfileForm({
  profileData,
  isEditing,
  handleProfileChange,
  handleSaveProfile,
}) {
  return (
    <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-5 sm:p-6 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-800/60 border border-gray-600 rounded-md disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full pl-10 py-2 bg-gray-800/60 border border-gray-600 rounded-md text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="mt-5 text-right">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
