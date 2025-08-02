export default function VolumeButton({
  isMuted,
  onToggle,
  showTooltip,
  autoTooltip,
  onMouseEnter,
  onMouseLeave,
  disabled,
}) {
  return (
    <div className="relative">
      <div
        className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm font-medium rounded shadow-lg whitespace-nowrap transition-all duration-300 ease-in-out ${
          showTooltip || autoTooltip
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {isMuted ? 'Unmute this video' : 'Mute this video'}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </div>
      <button
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        className="bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black/80 transition z-10 disabled:opacity-50 border border-gray-600"
      >
        {isMuted ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
