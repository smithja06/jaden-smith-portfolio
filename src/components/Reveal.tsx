import type { ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

/** Fades content up once when it enters the viewport. Content is visible without JS. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ once: true, rootMargin: '0px 0px -8% 0px' });
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
