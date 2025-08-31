import { Link, type LinkProps } from 'react-router-dom';
import type { ComponentPropsWithoutRef } from 'react';

export type ButtonProps = {
  className?: string;
  to?: LinkProps['to'];
  href?: string;
} & ComponentPropsWithoutRef<'button'> & ComponentPropsWithoutRef<'a'>;

export default function Button({ className = '', to, href, ...props }: ButtonProps) {
  const cls = ['btn', className].filter(Boolean).join(' ');
  if (to) {
    return <Link to={to} className={cls} {...(props as any)} />;
  }
  if (href) {
    return <a href={href} className={cls} {...(props as any)} />;
  }
  return <button className={cls} {...props} />;
}
