import { createContext, useContext, useState } from 'react';
const ModalContext = createContext();
export default function Modal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <ModalContext.Provider value={{ open, close, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
}
export const useModalContext = () => useContext(ModalContext);
