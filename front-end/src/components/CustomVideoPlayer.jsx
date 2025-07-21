import { useSocket } from '@/context/SocketProvider';
import React, { useEffect, useRef, useState } from 'react';

const VideoSyncPlayer = ({ roomId, videoUrl }) => {
  const { socket, isConnected } = useSocket();
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Check if the URL is a direct video file or needs embedding
  const getVideoSource = (url) => {
    if (!url) return { url: '', isDirect: false };
    
    // Check for direct video file URLs
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m3u8', '.mpd'];
    const isDirectVideo = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext) || 
      url.toLowerCase().includes(ext.split('.')[1] + '?')
    );
    
    if (isDirectVideo) {
      return { url, isDirect: true };
    }
    
    // Handle vidsrc.in URLs
    if (url.includes('vidsrc.in/embed/')) {
      return { url, isDirect: true };
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoId && videoId[1]) {
        return { 
          url: `https://www.youtube.com/embed/${videoId[1]}?enablejsapi=1`, 
          isDirect: false 
        };
      }
    }
    
    return { url: '', isDirect: false };
  };
  
  const { url: videoSource, isDirect } = getVideoSource(videoUrl);

  // Handle socket connection state
  useEffect(() => {
    if (!socket) {
      setError('WebSocket connection not available');
      return;
    }

    if (!isConnected) {
      setError('Connecting to server...');
      return;
    }

    setError(null);
    
    try {
      // Join the room
      socket.emit('video:join', { roomId });
      
      const handlePlay = ({ currentTime }) => {
        const video = videoRef.current;
        if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or greater
          video.currentTime = currentTime;
          video.play().catch(e => console.error('Playback failed:', e));
        }
      };

      const handlePause = ({ currentTime }) => {
        const video = videoRef.current;
        if (video) {
          video.currentTime = currentTime;
          video.pause();
        }
      };

      const handleSeek = ({ currentTime }) => {
        const video = videoRef.current;
        if (video) {
          video.currentTime = currentTime;
        }
      };

      const handleSync = ({ currentTime, isPlaying }) => {
        const video = videoRef.current;
        if (!video) return;
        
        // Small threshold to prevent unnecessary seeks
        if (Math.abs(video.currentTime - currentTime) > 0.5) {
          video.currentTime = currentTime;
        }
        
        if (isPlaying && video.paused) {
          video.play().catch(e => console.error('Sync play failed:', e));
        } else if (!isPlaying && !video.paused) {
          video.pause();
        }
      };

      // Set up event listeners
      socket.on('video:play', handlePlay);
      socket.on('video:pause', handlePause);
      socket.on('video:seek', handleSeek);
      socket.on('video:sync', handleSync);

      // Cleanup function
      return () => {
        socket.off('video:play', handlePlay);
        socket.off('video:pause', handlePause);
        socket.off('video:seek', handleSeek);
        socket.off('video:sync', handleSync);
        
        // Leave the room when component unmounts
        if (socket.connected) {
          socket.emit('video:leave', { roomId });
        }
      };
    } catch (err) {
      console.error('Error setting up video sync:', err);
      setError('Failed to set up video synchronization');
    }
  }, [socket, isConnected, roomId]);

  const handlePlay = () => {
    if (!socket || !socket.connected) {
      console.error('Cannot send play event: Socket not connected');
      return;
    }
    const currentTime = videoRef.current?.currentTime || 0;
    socket.emit('video:play', { roomId, currentTime });
  };

  const handlePause = () => {
    if (!socket || !socket.connected) return;
    const currentTime = videoRef.current?.currentTime || 0;
    socket.emit('video:pause', { roomId, currentTime });
  };

  const handleSeek = () => {
    if (!socket || !socket.connected) return;
    const currentTime = videoRef.current?.currentTime || 0;
    socket.emit('video:seek', { roomId, currentTime });
  };

  const requestSync = () => {
    if (socket?.connected) {
      const currentTime = videoRef.current?.currentTime || 0;
      const isPlaying = !videoRef.current?.paused;
      socket.emit('video:requestSync', { roomId, currentTime, isPlaying });
    }
  };

  const onLoadedMetadata = () => {
    setIsReady(true);
    requestSync();
  };

  const handleError = (e) => {
    console.error('Video error:', e);
    const video = e.target;
    let errorMessage = 'Failed to load video. ';
    
    switch(video.error?.code) {
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage += 'The video format is not supported.';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage += 'Network error. Please check your connection.';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage += 'Error decoding the video. The file might be corrupted.';
        break;
      default:
        errorMessage += 'Please check the URL and try again.';
    }
    
    setError(errorMessage);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-4xl mx-auto">
        <p className="font-bold">Video Playback Error</p>
        <p className="mt-2">{error}</p>
        {!isConnected ? (
          <p className="mt-2 text-sm">
            Please check your internet connection and refresh the page.
          </p>
        ) : (
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Player
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="video-container bg-black">
      <video
        ref={videoRef}
        src={videoSource}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
        onLoadedMetadata={onLoadedMetadata}
        onError={handleError}
        className="w-full max-w-4xl mx-auto"
        playsInline
        disablePictureInPicture
      />
      {!isReady && (
        <div className="text-center p-4">
          <p>Loading video player...</p>
        </div>
      )}
    </div>
  );
};

export default VideoSyncPlayer;
