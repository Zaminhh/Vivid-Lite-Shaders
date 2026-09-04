import { useEffect, useRef, useState } from 'react';

/**
 * Adds "in" class to a ref when it scrolls into view (once).
 * Use with .reveal, .reveal-scale, .bar-fill classes in CSS.
 * Cheap: uses a single IntersectionObserver per element, unobserves after firing.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: { threshold?: number; rootMargin?: string; delay?: number }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced motion — reveal immediately
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = window.setTimeout(() => setInView(true), options?.delay ?? 0);
            io.disconnect();
            return () => window.clearTimeout(t);
          }
        });
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? '0px 0px -60px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.delay]);

  return { ref, inView } as const;
}
