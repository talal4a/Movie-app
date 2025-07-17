import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Mail,
  ShieldCheck,
  User,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useMutation } from '@tanstack/react-query';
import { updatePassword, updateProfile } from '@/api/auth';
import { setCredentials } from '@/slice/userSlice';
import UserAvatar from '@/components/UserAvatar';
export default function Account() {
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.user?.loading);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    photo: null,
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileData);
      setProfilePhotoPreview(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSavePassword = async () => {
    try {
      const updatedUser = await updatePassword(passwordData);
      dispatch(setCredentials({ user: updatedUser, token }));
      alert('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert(error.message || 'Failed to update password');
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
        setProfileData((prev) => ({ ...prev, photo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfile(profileData),
    onSuccess: (updatedUser) => {
      dispatch(setCredentials({ user: updatedUser, token }));
      alert('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update profile');
    },
  });
  if (loading) return <Spinner />;
  return (
    <div className="min-h-screen bg-black text-white px-4  sm:px-6 py-8 sm:py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-6 sm:mb-10 pt-[30px]">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage your profile and security settings
          </p>
        </div>
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
                    onClick={() =>
                      document.getElementById('photo-upload').click()
                    }
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
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
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
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-5 sm:p-6 shadow-xl">
          <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2 mb-4">
            <Lock className="text-red-500" size={22} /> Security Settings
          </h2>

          <div className="space-y-5">
            {['currentPassword', 'newPassword', 'confirmPassword'].map(
              (key) => {
                const labelMap = {
                  currentPassword: 'Current Password',
                  newPassword: 'New Password',
                  confirmPassword: 'Confirm New Password',
                };
                const fieldKey =
                  key === 'currentPassword'
                    ? 'current'
                    : key === 'newPassword'
                      ? 'new'
                      : 'confirm';
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {labelMap[key]}
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-3 text-gray-400"
                        size={16}
                      />
                      <input
                        autoComplete="new-password"
                        type={showPasswords[fieldKey] ? 'text' : 'password'}
                        value={passwordData[key]}
                        onChange={(e) =>
                          handlePasswordChange(key, e.target.value)
                        }
                        className="w-full pl-10 pr-10 py-2 bg-gray-800/60 border border-gray-600 rounded-md text-sm"
                        placeholder={`Enter ${labelMap[key]}`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(fieldKey)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPasswords[fieldKey] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50 text-sm text-gray-400 space-y-1">
              <p className="text-gray-300 font-medium">
                Password Requirements:
              </p>
              <ul className="list-disc list-inside">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
            <div className="text-right">
              <button
                onClick={handleSavePassword}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"
              >
                <ShieldCheck size={16} /> Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
