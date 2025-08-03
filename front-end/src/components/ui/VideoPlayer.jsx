import React, { useEffect, useState } from 'react';

const VideoPlayer = ({ embedUrl, onClose }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        args[0].includes('Attestation check for Topics on https://vidsrc.in/')
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (!embedUrl) return;

    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
      let videoId = '';

      if (embedUrl.includes('youtu.be/')) {
        videoId = embedUrl.split('youtu.be/')[1];
      } else if (embedUrl.includes('v=')) {
        videoId = embedUrl.split('v=')[1];

        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      }

      if (videoId) {
        setVideoUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1`
        );
      }
    } else {
      setVideoUrl(embedUrl);
    }
  }, [embedUrl]);

  if (!videoUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-[90%] max-w-5xl relative">
        <iframe
          src={videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video rounded-xl"
          title="Movie Trailer"
          frameBorder="0"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 z-10"
          aria-label="Close video player"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
