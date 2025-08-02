import React from 'react';
const VideoPlayer = ({ embedUrl, onClose }) => {
  if (!embedUrl) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="w-[90%] max-w-5xl relative">
        <iframe
          src={embedUrl}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full aspect-video rounded-xl"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-black/90"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
export default VideoPlayer;
