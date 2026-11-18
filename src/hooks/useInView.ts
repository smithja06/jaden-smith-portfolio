import { useEffect, useRef, useState } from 'react';

/** Tracks whether an element is on screen. `once` stops observing after first hit. */
export function useInView<T extends Element>(options: { once?: boolean; rootMargin?: string } = {}) {
  const { once = false, rootMargin = '0px' } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) io.disconnect();
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);
  return [ref, inView] as const;
}
