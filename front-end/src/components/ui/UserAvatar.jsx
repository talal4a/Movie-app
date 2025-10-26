import { useState } from 'react';
export default function UserAvatar({ user, size = 32, preview = null }) {
  const [imageError, setImageError] = useState(false);
  const hasRealAvatar = user?.avatar && user.avatar !== 'default.jpg';
  const avatarUrl = preview || (hasRealAvatar
    ? `http://localhost:8000/img/users/${user.avatar}`
    : null);

  const fallbackLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
  };

  if (!avatarUrl || imageError) {
    const fontSize = Math.max(12, size * 0.4);

    return (
      <div
        style={{
          ...avatarStyle,
          fontSize: `${fontSize}px`,
          lineHeight: `${size}px`,
        }}
        className="bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold uppercase"
      >
        {fallbackLetter}
      </div>
    );
  }

  return (
    <div style={avatarStyle} className="relative">
      <img
        src={avatarUrl}
        onError={() => setImageError(true)}
        alt={`${user?.name || 'User'}'s avatar`}
        style={avatarStyle}
        className="rounded-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
