/**
 * Swaps the hyphens inside compound words ("Vision-to-Tactile", "Blind-Spot")
 * for non-breaking ones so headings never wrap mid-compound. Display only:
 * the stored titles keep plain hyphens for search, titles and tests.
 */
export const noBreakHyphens = (s: string) => s.replace(/(?<=\w)-(?=\w)/g, '‑');
