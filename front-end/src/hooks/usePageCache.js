import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const pageCache = new Map();

export const CachedRoute = ({ children, cacheName }) => {
  const location = useLocation();
  const contentRef = useRef(null);

  if (!pageCache.has(cacheName)) {
    pageCache.set(cacheName, children);
  }

  return pageCache.get(cacheName);
};
