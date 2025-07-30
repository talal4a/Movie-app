import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';
export const Toast = ({
  message,
  type = 'success',
  duration = 4000,
  onClose,
  show = true,
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };
  if (!isVisible) return null;
  const getToastStyles = () => {
    const baseStyles =
      'flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md border transition-all duration-300 ease-out transform';
    if (type === 'success') {
      return `${baseStyles} bg-green-900/90 border-green-500/30 text-green-100`;
    } else if (type === 'warning') {
      return `${baseStyles} bg-yellow-900/90 border-yellow-500/30 text-yellow-100`;
    } else {
      return `${baseStyles} bg-red-900/90 border-red-500/30 text-red-100`;
    }
  };
  const getIcon = () => {
    if (type === 'success') {
      return <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />;
    } else if (type === 'warning') {
      return (
        <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
      );
    } else {
      return <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />;
    }
  };
  const getCloseButtonStyles = () => {
    return 'text-white/60 hover:text-white/90 transition-colors duration-200 flex-shrink-0';
  };
  return (
    <div
      className={`
      fixed top-6 right-6 z-50 max-w-md w-full
      ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      transition-all duration-300 ease-out
    `}
    >
      <div className={getToastStyles()}>
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={handleClose} className={getCloseButtonStyles()}>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
