export default function HeroVideoBackground({
  videoRef,
  movie,
  videoEnded,
  isPaused,
  previewStarted,
  isPlaying,
  onEnded,
}) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        src={movie.previewTrailer}
        className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
          videoEnded || isPaused || !previewStarted || isPlaying
            ? 'opacity-0 scale-105'
            : 'opacity-100 scale-100'
        }`}
        muted
        playsInline
        loop={false}
        preload="auto"
        poster={movie.backdrop}
        onEnded={onEnded}
      />
      {(videoEnded || isPaused || !previewStarted || isPlaying) &&
        movie?.backdrop && (
          <>
            <img
              src={movie.backdrop}
              alt="Backdrop"
              className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </>
        )}
    </div>
  );
}
