import PropTypes from 'prop-types';
import { useState } from 'react';

export default function StarRating({
  maxRating = 5,
  color = '#fcc419',
  size = 32,
  className = '',
  value = 0,
  onChange = () => {},
  disabled = false,
  showText = false,
}) {
  const [tempRating, setTempRating] = useState(0);
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex">
        {stars.map((star) => (
          <Star
            key={star}
            full={tempRating ? tempRating >= star : value >= star}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setTempRating(star)}
            onMouseLeave={() => setTempRating(0)}
            color={color}
            size={size}
            disabled={disabled}
          />
        ))}
      </div>
      {showText && (tempRating || value) > 0 && (
        <p
          className="text-yellow-500 font-semibold"
          style={{ fontSize: size / 1.5 }}
        >
          {tempRating || value}
        </p>
      )}
    </div>
  );
}
function Star({
  full,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  size,
  disabled,
}) {
  return (
    <span
      role="button"
      className="transition-transform duration-200"
      style={{
        width: size,
        height: size,
        display: 'block',
        cursor: disabled ? 'default' : 'pointer',
        transform: full ? 'scale(1.1)' : 'scale(1)',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={color}
          viewBox="0 0 24 24"
          width={size}
          height={size}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke={color}
          viewBox="0 0 24 24"
          width={size}
          height={size}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

StarRating.propTypes = {
  maxRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showText: PropTypes.bool,
};
