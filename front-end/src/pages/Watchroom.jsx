// pages/Watchroom.jsx
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import VideoSyncPlayer from '@/components/CustomVideoPlayer';

export default function Watchroom() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user?.user);

  // Function to validate and format video URL
  const getValidVideoUrl = useCallback((url) => {
    if (!url) return '';

    // If it's a direct video file, return as is
    if (url.match(/\.(mp4|webm|ogg|mov|m3u8|mpd)(\?.*)?$/i)) {
      return url;
    }

    // Handle vidsrc.in URLs
    if (url.includes('vidsrc.in')) {
      // If it's already an embed URL, return it
      if (url.includes('/embed/')) {
        return url;
      }
      
      // If it's a vidsrc.in URL but not an embed, try to convert it
      const tmdbMatch = url.match(/[?&]tmdb=([^&]+)/);
      if (tmdbMatch) {
        return `https://vidsrc.in/embed/movie?tmdb=${tmdbMatch[1]}`;
      }
    }

    return url;
  }, []);

  useEffect(() => {
    const urlParam = searchParams.get('video');
    const defaultUrl = 'https://vidsrc.in/embed/movie?tmdb=777443'; // Default movie
    
    const finalUrl = urlParam ? decodeURIComponent(urlParam) : defaultUrl;
    const formattedUrl = getValidVideoUrl(finalUrl);
    
    setVideoUrl(formattedUrl);
    setIsLoading(false);
  }, [searchParams, getValidVideoUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">No Video Source</p>
          <p>No video URL found or the provided URL is not supported.</p>
          <p className="mt-2 text-sm">
            Please provide a valid video URL in the query parameter (?video=...).
            Supported formats: MP4, WebM, OGG, MOV, M3U8, MPD, or vidsrc.in links.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-white">Watch Room: {roomId}</h2>
        {videoUrl.includes('vidsrc.in') && (
          <p className="text-sm text-gray-400 mt-1">
            Note: vidsrc.in embeds may have limitations on playback controls and sync features.
          </p>
        )}
      </div>
      <div className="bg-black rounded-lg overflow-hidden shadow-xl">
        <VideoSyncPlayer 
          key={videoUrl} // Force re-render when URL changes
          roomId={roomId} 
          videoUrl={videoUrl} 
        />
      </div>
    </div>
  );
}
