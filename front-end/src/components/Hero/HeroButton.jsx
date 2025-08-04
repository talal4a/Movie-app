import { Play, Plus, Check } from 'lucide-react';
export default function HeroButtons({
  isSaved,
  justAdded,
  buttonDisabled,
  onPlay,
  onToggleWatchlist,
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        onClick={onPlay}
        className="bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg transform hover:scale-105 min-w-[100px]"
      >
        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        <span>Play</span>
      </button>
      <button
        onClick={onToggleWatchlist}
        disabled={buttonDisabled}
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base flex items-center justify-center space-x-2 backdrop-blur-sm min-w-[100px] transition-all duration-200 ${
          isSaved || justAdded
            ? 'bg-gray-600 text-white cursor-not-allowed'
            : 'bg-gray-600 bg-opacity-80 text-white hover:bg-gray-500 transform hover:scale-105'
        }`}
      >
        {isSaved || justAdded ? (
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        <span>My List</span>
      </button>
    </div>
  );
}
