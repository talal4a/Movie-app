import { useState } from 'react';
export default function UserAvatar({ user, size = 32 }) {
  const [imageError, setImageError] = useState(false);
  const avatarUrl = user?.avatar
    ? `http://localhost:8000/img/users/${user.avatar}`
    : null;
  const fallbackLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };
  if (!avatarUrl || imageError) {
    return (
      <div
        style={avatarStyle}
        className="bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase"
      >
        {fallbackLetter}
      </div>
    );
  }
  return (
    <img
      src={avatarUrl}
      onError={() => setImageError(true)}
      alt="User Avatar"
      style={avatarStyle}
      className="rounded-full object-cover"
    />
  );
}
