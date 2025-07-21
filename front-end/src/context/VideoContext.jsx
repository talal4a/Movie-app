import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';

const VideoContext = createContext();
export const useVideo = () => useContext(VideoContext);
export const VideoProvider = ({ children, roomId }) => {
  const socket = useRef();
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    socket.current = io('http://localhost:8000');

    socket.current.on('connect', () => {
      console.log('✅ Connected to Socket Server');
      socket.current.emit('video:join', roomId);
    });

    socket.current.on('video:play', ({ currentTime }) => {
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    });

    socket.current.on('video:pause', ({ currentTime }) => {
      videoRef.current.currentTime = currentTime;
      videoRef.current.pause();
    });

    socket.current.on('video:seek', ({ currentTime }) => {
      videoRef.current.currentTime = currentTime;
    });

    socket.current.on('video:sync', ({ currentTime, isPlaying }) => {
      videoRef.current.currentTime = currentTime;
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]);

  const value = {
    socket: socket.current,
    videoRef,
    isPlaying,
    setIsPlaying,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
