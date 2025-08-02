export default function HeroTitle({ mainTitle, subtitle }) {
  return (
    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-4 sm:mb-6 tracking-tight leading-[0.85] sm:leading-[0.9] max-w-4xl">
      <span className="block">{mainTitle}</span>
      {subtitle && (
        <span className="block text-gray-400 font-bold uppercase tracking-widest text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-5 max-w-3xl leading-tight break-words">
          {subtitle}
        </span>
      )}
    </h1>
  );
}
