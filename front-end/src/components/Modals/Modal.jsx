import useOutsideClick from '@/hooks/useOutsideClick';
import {
  createContext,
  useContext,
  useState,
  cloneElement,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg"></div>
      <div
        ref={ref}
        className="relative z-[1001] max-w-2xl w-full bg-[#141414] rounded-xl shadow-2xl transition-all duration-300 ease-out transform scale-100 opacity-100 border border-gray-600/50 text-white"
      >
        <button
          onClick={close}
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          {cloneElement(children, { onCloseModal: close })}
        </div>
      </div>
    </div>,
    document.body
  );
}
Modal.Open = Open;
Modal.Window = Window;
export default Modal;
