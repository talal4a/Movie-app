import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
const loadedImages = new Set();
class ImageLoader {
  constructor() {
    this.queue = [];
    this.loading = 0;
    this.maxConcurrent = 6;
  }
  add(src, priority = 0) {
    return new Promise((resolve) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }
      this.queue.push({ src, priority, resolve });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }
  async processQueue() {
    while (this.loading < this.maxConcurrent && this.queue.length > 0) {
      const { src, resolve } = this.queue.shift();
      this.loading++;

      const img = new Image();
      img.onload = () => {
        loadedImages.add(src);
        this.loading--;
        resolve();
        this.processQueue();
      };
      img.onerror = () => {
        this.loading--;
        resolve();
        this.processQueue();
      };
      img.src = src;
    }
  }
}
const imageLoader = new ImageLoader();
export const ProgressiveImage = ({
  src,
  alt,
  className = '',
  priority = 'high',
  loading = 'eager',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iIzM3NDE1MSIvPjwvc3ZnPg==',
}) => {
  const [loaded, setLoaded] = useState(false);

  // Load image immediately for all priorities
  useEffect(() => {
    if (!src) return;
    
    // Add to loaded images cache
    if (loadedImages.has(src)) {
      setLoaded(true);
      return;
    }
    
    // Create and load image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages.add(src);
      setLoaded(true);
    };
    
    // Cleanup
    return () => {
      img.onload = null;
    };
  }, [src]);
  
  // Show loading state
  if (!loaded) {
    return (
      <div className={`${className} bg-gray-800 animate-pulse`}>
        <img
          src={placeholder}
          alt=""
          className="opacity-0 w-full h-full"
          aria-hidden="true"
        />
      </div>
    );
  }
  
  // Show actual image
  return (
    <div className={`${className} relative overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        loading={loading}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
};

export const preloadCriticalImages = (images) => {
  images.forEach((src, index) => {
    imageLoader.add(src, 10 - index);
  });
};
