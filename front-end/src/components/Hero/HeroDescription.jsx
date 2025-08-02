export default function HeroDescription({ showDescription, description }) {
  return (
    <div
      className={`transition-all duration-1000 ease-in-out overflow-hidden ${
        showDescription
          ? 'max-h-32 opacity-100 transform translate-y-0'
          : 'max-h-0 opacity-0 transform -translate-y-4'
      }`}
    >
      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-200 max-w-lg lg:max-w-xl xl:max-w-2xl mb-6 sm:mb-8 leading-relaxed line-clamp-3">
        {description}
      </p>
    </div>
  );
}
