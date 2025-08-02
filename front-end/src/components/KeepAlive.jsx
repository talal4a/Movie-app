import { useLocation, useOutlet } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const KeepAlive = ({ include = [] }) => {
  const outlet = useOutlet();
  const location = useLocation();
  const alivePages = useRef({});
  const [, forceUpdate] = useState({});

  // Store current page
  useEffect(() => {
    if (outlet && include.includes(location.pathname)) {
      alivePages.current[location.pathname] = outlet;
      forceUpdate({});
    }
  }, [outlet, location.pathname, include]);

  return (
    <>
      {/* Render current route */}
      {outlet}

      {/* Keep other routes mounted but hidden */}
      {Object.entries(alivePages.current).map(([path, page]) => {
        if (path === location.pathname) return null;
        return (
          <div key={path} style={{ display: 'none' }}>
            {page}
          </div>
        );
      })}
    </>
  );
};

export default KeepAlive;
