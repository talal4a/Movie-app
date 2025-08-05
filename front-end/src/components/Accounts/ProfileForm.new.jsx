import { useState, useEffect } from 'react';
import { Mail, Save } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateName } from '@/utils/validations';

export default function ProfileForm({
  profileData,
  isEditing,
  handleProfileChange,
  handleSaveProfile,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [localProfileData, setLocalProfileData] = useState(profileData);

  // Update local state when profileData prop changes
  useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  // Validate on localProfileData change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = {};
      
      // Name validation
      if (touched.name) {
        if (!localProfileData.name) {
          newErrors.name = 'Name is required';
        } else if (!validateName(localProfileData.name)) {
          newErrors.name = 'Name can only contain letters and spaces';
        } else if (localProfileData.name.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (localProfileData.name.length > 50) {
          newErrors.name = 'Name must be less than 50 characters';
        }
      }
      
      setErrors(newErrors);
    }
  }, [localProfileData, touched]);

  const handleLocalChange = (field, value) => {
    setLocalProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
    
    // Propagate changes to parent
    handleProfileChange(field, value);
  };

  const handleBlur = (field) => {
    if (!touched[field]) {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  const handleLocalSave = () => {
    // Mark all fields as touched to show all errors
    const allTouched = {
      name: true,
    };
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    
    if (!localProfileData.name) {
      newErrors.name = 'Name is required';
    } else if (!validateName(localProfileData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    } else if (localProfileData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (localProfileData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    
    setErrors(newErrors);
    
    // Only save if there are no errors
    if (Object.keys(newErrors).length === 0) {
      handleSaveProfile();
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-5 sm:p-6 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={localProfileData.name || ''}
              onChange={(e) => handleLocalChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-800/60 border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } rounded-md disabled:opacity-50`}
            />
            <ErrorMessage message={errors.name} className="mt-1" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="email"
              value={localProfileData.email || ''}
              disabled
              className="w-full pl-10 py-2 bg-gray-800/60 border border-gray-600 rounded-md text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="mt-5 text-right">
          <button
            onClick={handleLocalSave}
            disabled={Object.keys(errors).length > 0}
            className={`px-5 py-2 rounded-md flex items-center gap-2 ${
              Object.keys(errors).length > 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
