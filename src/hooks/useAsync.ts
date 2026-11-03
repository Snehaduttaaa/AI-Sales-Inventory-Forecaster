import { useEffect, useState } from 'react';
import type { DependencyList } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
}

export function useAsync<T>(load: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: undefined }));
    load()
      .then((data) => {
        if (!cancelled) setState({ data, error: undefined, loading: false });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ data: undefined, error: error instanceof Error ? error.message : String(error), loading: false });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
