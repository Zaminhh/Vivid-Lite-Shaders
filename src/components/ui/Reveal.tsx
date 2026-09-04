import { type ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { cn } from '../../utils/cn';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'scale';
  as?: 'div' | 'section' | 'article' | 'li' | 'ul' | 'span';
}

export default function Reveal({ children, className, delay = 0, variant = 'up', as: Tag = 'div' }: Props) {
  const { ref, inView } = useReveal<HTMLElement>({ delay });
  const base = variant === 'scale' ? 'reveal-scale' : 'reveal';
  const Component = Tag as 'div';
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} className={cn(base, inView && 'in', className)}>
      {children}
    </Component>
  );
}
