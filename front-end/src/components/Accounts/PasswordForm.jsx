import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validatePassword, getPasswordStrength } from '@/utils/validations';

export default function PasswordForm({
  passwordData,
  showPasswords,
  handlePasswordChange,
  togglePasswordVisibility,
  handleSavePassword,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [localPasswordData, setLocalPasswordData] = useState(passwordData);

  useEffect(() => {
    setLocalPasswordData(passwordData);
  }, [passwordData]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = {};

      if (touched.currentPassword && !localPasswordData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      if (touched.newPassword) {
        if (!localPasswordData.newPassword) {
          newErrors.newPassword = 'New password is required';
        } else if (localPasswordData.newPassword.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!validatePassword(localPasswordData.newPassword)) {
          newErrors.newPassword =
            'Password must contain at least one uppercase, one lowercase, one number, and one special character';
        }
      }

      if (touched.confirmPassword) {
        if (!localPasswordData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your new password';
        } else if (
          localPasswordData.newPassword !== localPasswordData.confirmPassword
        ) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }

      setErrors(newErrors);
    }

    if (localPasswordData.newPassword) {
      setPasswordStrength(getPasswordStrength(localPasswordData.newPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [localPasswordData, touched]);

  const handleLocalChange = (key, value) => {
    setLocalPasswordData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (!touched[key]) {
      setTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    }

    handlePasswordChange(key, value);
  };

  const handleBlur = (field) => {
    if (!touched[field]) {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    }
  };

  const handleLocalSave = () => {
    const allTouched = {
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    const newErrors = {};

    if (!localPasswordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!localPasswordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (localPasswordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!validatePassword(localPasswordData.newPassword)) {
      newErrors.newPassword =
        'Password must contain at least one uppercase, one lowercase, one number, and one special character';
    }

    if (!localPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (
      localPasswordData.newPassword !== localPasswordData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSavePassword();
    }
  };

  const fields = ['currentPassword', 'newPassword', 'confirmPassword'];
  const labelMap = {
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-5 sm:p-6 shadow-xl">
      <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2 mb-4">
        <Lock className="text-red-500" size={22} /> Security Settings
      </h2>
      <div className="space-y-5">
        {fields.map((key) => {
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
                  autoComplete={
                    key === 'currentPassword'
                      ? 'current-password'
                      : 'new-password'
                  }
                  type={showPasswords[fieldKey] ? 'text' : 'password'}
                  value={localPasswordData[key] || ''}
                  onChange={(e) => handleLocalChange(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  className={`w-full pl-10 pr-10 py-2 bg-gray-800/60 border ${
                    errors[key] ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-sm`}
                  placeholder={`Enter ${labelMap[key]}`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(fieldKey)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  aria-label={
                    showPasswords[fieldKey] ? 'Hide password' : 'Show password'
                  }
                >
                  {showPasswords[fieldKey] ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {key === 'newPassword' && localPasswordData.newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Password Strength:</span>
                    <span>
                      {passwordStrength < 2
                        ? 'Weak'
                        : passwordStrength < 4
                          ? 'Good'
                          : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        passwordStrength < 2
                          ? 'bg-red-500'
                          : passwordStrength < 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <ErrorMessage message={errors[key]} className="mt-1" />
            </div>
          );
        })}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50 text-sm text-gray-400 space-y-1">
          <p className="text-gray-300 font-medium">Password Requirements:</p>
          <ul className="list-disc list-inside">
            <li
              className={
                localPasswordData.newPassword?.length >= 8
                  ? 'text-green-400'
                  : ''
              }
            >
              At least 8 characters long
            </li>
            <li
              className={
                /[A-Z]/.test(localPasswordData.newPassword)
                  ? 'text-green-400'
                  : ''
              }
            >
              Include uppercase letters
            </li>
            <li
              className={
                /[a-z]/.test(localPasswordData.newPassword)
                  ? 'text-green-400'
                  : ''
              }
            >
              Include lowercase letters
            </li>
            <li
              className={
                /[0-9]/.test(localPasswordData.newPassword)
                  ? 'text-green-400'
                  : ''
              }
            >
              Include at least one number
            </li>
            <li
              className={
                /[^A-Za-z0-9]/.test(localPasswordData.newPassword)
                  ? 'text-green-400'
                  : ''
              }
            >
              Include at least one special character
            </li>
          </ul>
        </div>
        <div className="text-right">
          <button
            onClick={handleLocalSave}
            disabled={Object.keys(errors).length > 0}
            className={`px-5 py-2 rounded-md flex items-center gap-2 ${
              Object.keys(errors).length > 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ShieldCheck size={16} /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
