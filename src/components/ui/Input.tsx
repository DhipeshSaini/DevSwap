import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="group relative w-full">
        {label && (
          <label className="absolute -top-2 left-4 px-1 bg-surface text-[10px] font-bold text-primary tracking-widest z-10">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-14 px-6 rounded-xl bg-surface-container-lowest border-[0.5px] border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-sans text-on-surface placeholder:text-outline-variant',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
