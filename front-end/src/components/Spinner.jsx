export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-red-600 rounded-full animate-spin duration-400" />
      </div>
    </div>
  );
}
