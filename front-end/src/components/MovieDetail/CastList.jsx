import { useState } from 'react';

export default function CastList({ cast }) {
  const [loadedImages, setLoadedImages] = useState({});
  const [erroredImages, setErroredImages] = useState({});

  const handleImageError = (index) => {
    setErroredImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  if (!cast?.length) return null;
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      <div className="flex flex-wrap gap-4 space-y-1">
        {cast
          .filter((actor) => actor.avatar)
          .slice(0, 6)
          .map((actor, index) => {
            const hasError = erroredImages[index];
            const hasLoaded = loadedImages[index];
            const showFallback = hasError || !actor.avatar;
            
            return (
              <div
                key={index}
                className="flex w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)] items-center gap-4"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  {!showFallback && (
                    <img
                      src={actor.avatar}
                      alt={actor.name}
                      className={`w-full h-full rounded-full object-cover border border-gray-700 ${
                        hasLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onError={() => handleImageError(index)}
                      onLoad={() => handleImageLoad(index)}
                      loading="lazy"
                    />
                  )}
                  {showFallback && (
                    <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {actor.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{actor.name || 'Unknown'}</div>
                  {actor.character && (
                    <div className="text-sm text-gray-400 truncate" title={actor.character}>
                      {actor.character}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
