import { ThumbsUp } from 'lucide-react';
export default function HeroStats({ matchPercentage, releaseYear }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-green-400 font-bold text-base sm:text-lg lg:text-xl">
          {matchPercentage}% Match
        </span>
        <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
      </div>
      <div className="text-gray-300">{releaseYear}</div>
    </div>
  );
}
