import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-secondary-container text-on-secondary-container',
      primary: 'bg-primary-container text-on-primary-container',
      secondary: 'bg-secondary-container text-on-secondary-container',
      tertiary: 'bg-tertiary-container text-on-tertiary-container',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 cursor-default',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Chip.displayName = 'Chip';

export { Chip };
