import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function PasswordForm({
  passwordData,
  showPasswords,
  handlePasswordChange,
  togglePasswordVisibility,
  handleSavePassword,
}) {
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
                  autoComplete="new-password"
                  type={showPasswords[fieldKey] ? 'text' : 'password'}
                  value={passwordData[key]}
                  onChange={(e) => handlePasswordChange(key, e.target.value)}
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
        })}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50 text-sm text-gray-400 space-y-1">
          <p className="text-gray-300 font-medium">Password Requirements:</p>
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
  );
}
