'use client';

import { ReactNode } from 'react';

interface RippleTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'button' | 'a' | 'div';
  href?: string;
}

export function RippleText({ children, className = '', as: Component = 'div', href }: RippleTextProps) {
  const props = {
    className: `relative ${className}`,
    style: { perspective: '1000px' },
    ...(href && { href })
  };

  return (
    <Component {...props as any}>
      {children}
    </Component>
  );
}
