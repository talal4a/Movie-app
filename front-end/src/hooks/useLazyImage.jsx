import { useEffect, useRef, useState } from 'react';
let observer;
const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const { target, isIntersecting } = entry;
            if (isIntersecting && target.dataset.observer) {
              const setVisible = window[target.dataset.observer];
              setVisible(true);
              observer.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
    );
  }
  return observer;
};
export function useLazyImage(src, eager = false) {
  const imgRef = useRef(null);
  const [isVisible, setVisible] = useState(eager);
  const observerId = useRef(
    `observer_${Math.random().toString(36).substr(2, 9)}`
  );
  useEffect(() => {
    const currentRef = imgRef.current;
    const observer = getObserver();

    if (eager) return;

    if (currentRef && !isVisible) {
      window[observerId.current] = setVisible;
      currentRef.dataset.observer = observerId.current;
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        delete window[observerId.current];
      }
    };
  }, [eager, isVisible]);

  useEffect(() => {
    return () => {
      delete window[observerId.current];
    };
  }, []);

  return {
    imgRef,
    isVisible,
    src: isVisible ? src : undefined,
    loading: isVisible ? 'eager' : 'lazy',
  };
}
