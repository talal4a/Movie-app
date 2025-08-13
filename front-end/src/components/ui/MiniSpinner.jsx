import React from 'react';
export default function MiniSpinner({
  size = 'sm',
  color = 'border-red-600',
  className = '',
  'aria-label': ariaLabel = 'Loading…',
}) {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-6 h-6 border-[3px]',
    lg: 'w-8 h-8 border-4',
  };
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`inline-block align-middle ${className}`}
    >
      <span
        className={`
          ${sizes[size]} rounded-full animate-spin
          border-transparent border-t-current
          ${color}
        `}
        style={{ display: 'inline-block' }}
      />
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}
