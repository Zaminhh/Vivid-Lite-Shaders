import { useEffect, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

/** Counts from 0 to `value` when it scrolls into view. Uses requestAnimationFrame. */
export default function AnimatedNumber({ value, duration = 1200, suffix = '', prefix = '', decimals = 0, className }: Props) {
  const { ref, inView } = useReveal<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const shown = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();
  return (
    <span ref={ref} className={className}>
      {prefix}{shown}{suffix}
    </span>
  );
}
