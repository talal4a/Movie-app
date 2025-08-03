import React, { useEffect, useState, useRef } from 'react';

const VideoPlayer = ({ embedUrl, onClose, movieId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef(null);

  // Load saved position when component mounts
  useEffect(() => {
    if (movieId) {
      const savedTime = localStorage.getItem(`video_${movieId}_time`);
      if (savedTime) {
        setCurrentTime(parseFloat(savedTime));
      }
    }
  }, [movieId]);

  // Save position when component unmounts
  useEffect(() => {
    return () => {
      if (movieId && currentTime > 0) {
        localStorage.setItem(`video_${movieId}_time`, currentTime.toString());
        // You can also send this to your backend here
        console.log(`Saved position for movie ${movieId}: ${currentTime} seconds`);
      }
    };
  }, [currentTime, movieId]);
  const [videoUrl, setVideoUrl] = useState('');

  // Function to validate and format the video URL
  const getValidVideoUrl = (url) => {
    if (!url) {
      console.error('No video URL provided');
      return null;
    }

    try {
      // Handle YouTube URLs
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        
        // Handle youtu.be links
        if (url.includes('youtu.be/')) {
          const match = url.match(/youtu\.be\/([^?&#]+)/);
          videoId = match ? match[1] : '';
        } 
        // Handle youtube.com/watch?v= links
        else if (url.includes('v=')) {
          const match = url.match(/[?&]v=([^?&#]+)/);
          videoId = match ? match[1] : '';
        }
        
        if (!videoId) {
          console.error('Could not extract YouTube video ID from URL:', url);
          return null;
        }
        
        // Clean up video ID (remove any extra path or parameters)
        videoId = videoId.split(/[?&#]/)[0];
        
        // Create embed URL with autoplay and other parameters
        const embedParams = new URLSearchParams({
          autoplay: 1,
          mute: 1,
          enablejsapi: 1,
          rel: 0, // Don't show related videos at the end
          modestbranding: 1, // Hide YouTube logo
          start: Math.floor(currentTime) // Start at saved position
        });
        
        return `https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`;
      }
      
      // For vidsrc.in URLs
      if (url.includes('vidsrc.in')) {
        // Just return the URL as is, let the iframe handle it
        return url;
      }
      
      // For other URLs, try to use as is
      try {
        new URL(url);
        return url;
      } catch (e) {
        console.error('Invalid URL format:', url);
        return null;
      }
      
    } catch (e) {
      console.error('Error processing video URL:', e);
      return null;
    }
  };

  // Update video URL when embedUrl changes
  useEffect(() => {
    console.log('VideoPlayer received embedUrl:', embedUrl);
    
    if (!embedUrl) {
      console.error('No embed URL provided');
      setError('No video URL provided');
      setLoading(false);
      return;
    }
    
    // Ensure we have a valid string
    const urlStr = String(embedUrl).trim();
    if (!urlStr) {
      console.error('Empty video URL provided');
      setError('No video URL provided');
      setLoading(false);
      return;
    }
    
    console.log('Processing video URL:', urlStr);
    setLoading(true);
    setError(null);
    
    try {
      // For vidsrc.in, use the URL as is
      if (urlStr.includes('vidsrc.in')) {
        console.log('Using vidsrc.in URL directly:', urlStr);
        setVideoUrl(urlStr);
        return;
      }
      
      // For other URLs, use the validation function
      const validUrl = getValidVideoUrl(urlStr);
      
      if (validUrl) {
        console.log('Setting video URL:', validUrl);
        setVideoUrl(validUrl);
      } else {
        throw new Error('Invalid or unsupported URL format');
      }
    } catch (error) {
      console.error('Error processing video URL:', error);
      setError('This video source is not supported or the URL is invalid.');
      setLoading(false);
    }
  }, [embedUrl]);

  if (!videoUrl) {
    console.error('No valid video URL provided');
    return null;
  }

  // Check if this is a vidsrc.in URL
  const isVidSrc = videoUrl.includes('vidsrc.in');

  const handleIframeError = () => {
    console.error('Failed to load video:', videoUrl);
    setError('Failed to load video. Please try again later.');
    setLoading(false);
  };

  const handleIframeLoad = () => {
    console.log('Video loaded successfully');
    setLoading(false);
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={(e) => {
        // Close when clicking on the background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full h-full max-w-6xl relative">
        {isVidSrc ? (
          // Special handling for vidsrc.in
          <div className="w-full h-full">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-white text-center p-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading video player...</p>
                </div>
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-white text-center p-4">
                  <p className="text-red-400 mb-4">{error}</p>
                  <p className="text-sm text-gray-300 mb-4">If the video doesn't load, you can try:</p>
                  <div className="space-y-2">
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Open in New Tab
                    </a>
                    <button 
                      onClick={onClose}
                      className="block w-full mt-2 text-gray-300 hover:text-white"
                    >
                      Close Player
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                key={videoUrl} // Force re-render when URL changes
                src={videoUrl}
                className="w-full h-full"
                title="Movie Player"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  overflow: 'hidden',
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
            )}
          </div>
        ) : (
          // Standard iframe for YouTube and other platforms
          <div className="w-full aspect-video relative">
            <iframe
              ref={iframeRef}
              src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}start=${Math.floor(currentTime)}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
              title="Movie Player"
              frameBorder="0"
              onLoad={() => {
                // Time tracking for non-vidsrc players
                const timer = setInterval(() => {
                  try {
                    console.log('Would update video time here');
                  } catch (e) {
                    console.error('Error getting video time:', e);
                  }
                }, 1000);
                return () => clearInterval(timer);
              }}
            />
          </div>
        )}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/90 z-10"
          aria-label="Close video player"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
