import { useModalContext } from './Modal';
export default function ModalTrigger({ children }) {
  const { open } = useModalContext();
  return (
    <button onClick={open} className="text-red-600">
      {children}
    </button>
  );
}
