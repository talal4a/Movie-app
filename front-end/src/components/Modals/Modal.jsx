import useOutsideClick from '@/hooks/useOutsideClick';
import {
  createContext,
  useContext,
  useState,
  cloneElement,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
const ModalContext = createContext();
function Modal({ children }) {
  const [openName, setOpenName] = useState('');
  const open = useCallback((name) => setOpenName(name), []);
  const close = useCallback(() => setOpenName(''), []);
  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}
function Open({ children, opens: windowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: () => open(windowName),
  });
}
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick({ handler: close });
  if (name !== openName) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={ref}
        className="relative z-[1001] max-w-xl w-full bg-white rounded-lg shadow-xl p-8 transition-all"
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 p-1 rounded-full"
        >
          <HiXMark className="w-6 h-6" />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}
Modal.Open = Open;
Modal.Window = Window;
export default Modal;
