import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { experiments, stationById, type ExperimentId, type StationId } from '../config/stations';

/**
 * Lab state lives in the URL (?station=…&exp=…&view=list) so every station is
 * deep-linkable and the browser back button returns to the overview.
 */
export function useLabNavigation() {
  const [params, setParams] = useSearchParams();
  const selected: StationId | null = stationById(params.get('station'))?.id ?? null;
  const experiment: ExperimentId | null = experiments.find((e) => e.id === params.get('exp'))?.id ?? null;
  const view: 'world' | 'list' = params.get('view') === 'list' ? 'list' : 'world';

  const update = useCallback((patch: Record<string, string | null>, replace = false) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null) next.delete(k); else next.set(k, v);
      }
      return next;
    }, { replace, preventScrollReset: true });
  }, [setParams]);

  return {
    selected,
    experiment,
    view,
    select: useCallback((id: StationId) => update({ station: id, exp: null }), [update]),
    reset: useCallback(() => update({ station: null, exp: null }), [update]),
    openExperiment: useCallback((id: ExperimentId) => update({ exp: id }), [update]),
    closeExperiment: useCallback(() => update({ exp: null }, true), [update]),
    setView: useCallback((v: 'world' | 'list') => update({ view: v === 'list' ? 'list' : null, station: null, exp: null }), [update]),
  };
}
