import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const pageCache = new Map();

export const CachedRoute = ({ children, cacheName }) => {
  const location = useLocation();
  const contentRef = useRef(null);

  // Store the component in cache
  if (!pageCache.has(cacheName)) {
    pageCache.set(cacheName, children);
  }

  // Always return the cached version
  return pageCache.get(cacheName);
};
