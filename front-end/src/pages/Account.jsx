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
export default function Account() {
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.user?.loading);
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
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileData);
      setProfilePhotoPreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
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
        setProfileData((prev) => ({
          ...prev,
          photo: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfile(profileData),
    onSuccess: (updatedUser) => {
      dispatch(setCredentials({ user: updatedUser, token }));
      alert('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (err) => {
      console.error('Update profile error:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    },
  });
  console.log('Redux user:', user);
  if (loading) return <Spinner />;
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-400">
            Manage your profile and security settings
          </p>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <User className="text-red-500" size={24} />
              Profile Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden">
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : user?.avatar ? (
                  <img
                    src={`http://localhost:8000/img/users/${user.avatar}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200 border-2 border-black"
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
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">
                {user?.name || 'User'}
              </h3>
              <p className="text-gray-400 mb-2">
                {user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <ShieldCheck size={16} />
                <span>Verified Account</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  disabled={true}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Lock className="text-red-500" size={24} />
              Security Settings
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange('currentPassword', e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange('newPassword', e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange('confirmPassword', e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
                <li>• Include at least one special character</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSavePassword}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <ShieldCheck size={18} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
