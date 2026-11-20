import { useLocation } from 'react-router-dom';
import { PROJECTS_HUB } from '../content/projects';
import { EXPERIENCE_HUB } from '../content/experience';
import { recallScroll, type ScrollRestoreState } from './scrollMemory';

/** Where on a hub a visitor came from: its query string and history entry. */
interface HubOrigin {
  search: string;
  key: string;
}
export interface FromHubState {
  fromHub?: HubOrigin;
}

/** Router state for links that leave a hub (Projects, Experience), so the detail page can send the visitor back. */
export function useHubLinkState(): FromHubState {
  const { search, key } = useLocation();
  return { fromHub: { search, key } };
}

/**
 * Target of a detail page's "All …" link. Opened from the hub, it returns to
 * the same query (search, filter) and scroll position; opened directly, it is
 * simply the hub. Never relies on browser history.
 * `carry` is the state to pass along to sibling detail links.
 */
export function useHubReturn(hub: string): { to: string; state?: ScrollRestoreState; carry?: FromHubState } {
  const { state } = useLocation();
  const from = (state as FromHubState | null)?.fromHub;
  if (!from) return { to: hub };
  const y = recallScroll(from.key);
  return {
    to: `${hub}${from.search}`,
    state: y !== undefined ? { restoreScroll: y } : undefined,
    carry: { fromHub: from },
  };
}

export const useProjectsReturn = () => useHubReturn(PROJECTS_HUB);
export const useExperienceReturn = () => useHubReturn(EXPERIENCE_HUB);
