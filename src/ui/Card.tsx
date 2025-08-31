import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type CardProps<E extends ElementType = 'div'> = {
  as?: E;
  className?: string;
} & ComponentPropsWithoutRef<E>;

export default function Card<E extends ElementType = 'div'>({ as, className = '', ...props }: CardProps<E>) {
  const Component = as || 'div';
  const cls = ['card', className].filter(Boolean).join(' ');
  return <Component className={cls} {...props} />;
}
