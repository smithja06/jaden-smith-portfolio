import { useLocation } from 'react-router-dom';
import { PROJECTS_HUB } from '../content/projects';
import { recallScroll, type ScrollRestoreState } from './scrollMemory';

/** Where on the hub a visitor came from: its query string and history entry. */
interface HubOrigin {
  search: string;
  key: string;
}
export interface FromHubState {
  fromHub?: HubOrigin;
}

/** Router state for links that leave the Projects hub, so the case study can send the visitor back. */
export function useHubLinkState(): FromHubState {
  const { search, key } = useLocation();
  return { fromHub: { search, key } };
}

/**
 * Target of a case study's "All Projects" link. Opened from the hub, it
 * returns to the same search, category and scroll position; opened directly,
 * it is simply /lab/projects. Never relies on browser history.
 * `carry` is the state to pass along to sibling case-study links.
 */
export function useProjectsReturn(): { to: string; state?: ScrollRestoreState; carry?: FromHubState } {
  const { state } = useLocation();
  const from = (state as FromHubState | null)?.fromHub;
  if (!from) return { to: PROJECTS_HUB };
  const y = recallScroll(from.key);
  return {
    to: `${PROJECTS_HUB}${from.search}`,
    state: y !== undefined ? { restoreScroll: y } : undefined,
    carry: { fromHub: from },
  };
}
