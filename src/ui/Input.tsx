import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    const cls = ['input', className].filter(Boolean).join(' ');
    return <input ref={ref} className={cls} {...props} />;
  }
);

Input.displayName = 'Input';

export default Input;
