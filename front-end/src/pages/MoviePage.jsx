import { useEffect, useState } from 'react';
import GroupedMovieCollections from '@/components/Features/GroupedMovieCollections';

export default function MoviePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div 
      className="flex flex-col min-h-screen bg-black pt-20 md:pt-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <main className="p-4 md:p-8 lg:p-10">
        <section className="my-6 md:my-8 lg:my-10">
          <div 
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              transitionDelay: '0.1s',
            }}
          >
            <GroupedMovieCollections />
          </div>
        </section>
      </main>
    </div>
  );
}
