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
  priority = 0,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iIzM3NDE1MSIvPjwvc3ZnPg==',
}) => {
  const [loaded, setLoaded] = useState(loadedImages.has(src));
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (inView && !loaded) {
      imageLoader.add(src, priority).then(() => setLoaded(true));
    }
  }, [inView, src, priority, loaded]);
  return (
    <div ref={ref} className={`${className} relative overflow-hidden`}>
      <img
        src={loaded ? src : placeholder}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        fetchpriority={priority > 5 ? 'high' : 'low'}
      />
    </div>
  );
};

export const preloadCriticalImages = (images) => {
  images.forEach((src, index) => {
    imageLoader.add(src, 10 - index);
  });
};
