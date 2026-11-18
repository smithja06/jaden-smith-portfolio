import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
}

/** Fades content up once when it enters the viewport. Content is visible without JS. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, style, ...rest }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ once: true, rootMargin: '0px 0px -8% 0px' });
  return (
    <Tag
      ref={ref}
      {...rest}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
