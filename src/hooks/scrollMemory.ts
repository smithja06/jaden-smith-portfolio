/**
 * Last known scroll position per history entry (location.key), kept in
 * memory for the session. Layout writes it; links that want to return a
 * visitor to where they were read it.
 */
const positions = new Map<string, number>();

export function rememberScroll(key: string, y: number) {
  positions.set(key, y);
}

export function recallScroll(key: string | undefined): number | undefined {
  return key ? positions.get(key) : undefined;
}

/** Router state that asks Layout to restore a scroll position instead of starting at the top. */
export interface ScrollRestoreState {
  restoreScroll?: number;
}
