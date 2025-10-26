import { Toast } from '@/components/ui/Toast';
import { createContext, useCallback, useContext, useState } from 'react';
const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback(
    ({ message, type = 'success', duration = 4000 }) => {
      setToast({ message, type, duration, id: Date.now() });
    },
    []
  );
  const handleClose = () => {
    setToast(null);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);