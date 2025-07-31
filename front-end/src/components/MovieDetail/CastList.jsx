export default function CastList({ cast }) {
  if (!cast?.length) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      <div className="flex flex-wrap gap-4 space-y-1">
        {cast
          .filter((actor) => actor.avatar)
          .slice(0, 6)
          .map((actor, index) => (
            <div
              key={index}
              className="flex w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)] items-center gap-4"
            >
              <img
                src={actor.avatar}
                alt={actor.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
              <div>
                <div className="font-medium text-white">{actor.name}</div>
                <div className="text-sm text-gray-400">{actor.character}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
