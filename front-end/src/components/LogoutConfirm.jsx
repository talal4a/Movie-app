export default function LogoutConfirm({ onCloseModal }) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Confirm Logout</h2>
      <p>Are you sure you want to log out?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCloseModal}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log('Logged out');
            onCloseModal();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
