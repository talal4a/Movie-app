export default function LogoutConfirm({ onCloseModal, message, heading,button }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">{heading}</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-600/30">
        <button
          onClick={onCloseModal}
          className="px-8 py-3 text-white bg-transparent border border-gray-500 rounded-lg hover:border-gray-400 hover:bg-white/5 transition-all duration-200 font-semibold text-base"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onCloseModal();
          }}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 font-semibold text-base shadow-xl hover:shadow-red-500/25"
        >
          {button}
        </button>
      </div>
    </div>
  );
}
