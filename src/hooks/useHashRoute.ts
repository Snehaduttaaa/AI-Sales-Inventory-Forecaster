import { useCallback, useEffect, useState } from 'react';

function readHash(fallback: string): string {
  return window.location.hash.replace(/^#\/?/, '') || fallback;
}

/** Minimal hash router: #/forecast, #/inventory ... Works on GitHub Pages without a server. */
export function useHashRoute(fallback: string): [string, (route: string) => void] {
  const [route, setRoute] = useState<string>(() => readHash(fallback));

  useEffect(() => {
    const onChange = () => setRoute(readHash(fallback));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [fallback]);

  const navigate = useCallback((next: string) => {
    window.location.hash = `/${next}`;
  }, []);

  return [route, navigate];
}
