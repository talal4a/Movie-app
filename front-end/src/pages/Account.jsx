import AccountLayout from '@/components/Accounts/AccountLayout';
import PasswordForm from '@/components/Accounts/PasswordForm';
import ProfileForm from '@/components/Accounts/ProfileForm';
import ProfileInfo from '@/components/Accounts/ProfileInfo';
import Spinner from '@/components/Spinner';
import { useMutation } from '@tanstack/react-query';
import { updatePassword, updateProfile } from '@/api/auth';
import { setCredentials } from '@/redux/slice/userSlice';
import { useToast } from '@/context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
export default function Account() {
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.user?.loading);
  const dispatch = useDispatch();
  const { showToast } = useToast();
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
    } catch (err) {
      showToast({ message: 'Profile is not updated', type: 'error' });
    }
  };
  const handleSavePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return showToast({
        message: 'Please fill out all password fields',
        type: 'warning',
      });
    }

    if (newPassword !== confirmPassword) {
      return showToast({
        message: 'New password and confirm password do not match',
        type: 'warning',
      });
    }

    if (newPassword.length < 8) {
      return showToast({
        message: 'Password must be at least 8 characters long',
        type: 'warning',
      });
    }

    try {
      const updatedUser = await updatePassword(passwordData, token);
      dispatch(setCredentials({ user: updatedUser, token }));
      showToast({
        message: 'Password updated successfully',
        type: 'success',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Password update error:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update password';
      showToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          message: 'Image size should be less than 5MB',
          type: 'warning',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast({
          message: 'Please select a valid image file',
          type: 'warning',
        });
        return;
      }

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
    mutationFn: () => updateProfile(profileData, token),
    onSuccess: (updatedUser) => {
      dispatch(setCredentials({ user: updatedUser, token }));
      showToast({
        message: 'Profile is updated successfully',
        type: 'success',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile';
      showToast({ message: errorMessage, type: 'error' });
    },
  });
  if (loading) return <Spinner />;
  return (
    <AccountLayout>
      <ProfileInfo
        user={user}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleProfilePhotoChange={handleProfilePhotoChange}
        profilePhotoPreview={profilePhotoPreview}
      />
      <ProfileForm
        profileData={profileData}
        isEditing={isEditing}
        handleProfileChange={handleProfileChange}
        handleSaveProfile={handleSaveProfile}
      />
      <PasswordForm
        passwordData={passwordData}
        showPasswords={showPasswords}
        handlePasswordChange={handlePasswordChange}
        togglePasswordVisibility={togglePasswordVisibility}
        handleSavePassword={handleSavePassword}
      />
    </AccountLayout>
  );
}
