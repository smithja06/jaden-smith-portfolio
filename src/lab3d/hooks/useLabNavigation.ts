import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Lab view mode lives in the URL (?view=list) so the list view is linkable. */
export function useLabNavigation() {
  const [params, setParams] = useSearchParams();
  const view: 'world' | 'list' = params.get('view') === 'list' ? 'list' : 'world';

  const setView = useCallback((v: 'world' | 'list') => {
    setParams(v === 'list' ? { view: 'list' } : {}, { preventScrollReset: true });
  }, [setParams]);

  return { view, setView };
}
