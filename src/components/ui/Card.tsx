import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-container-lowest ambient-shadow',
      elevated: 'bg-surface-container-lowest shadow-2xl',
      glass: 'glass-effect ghost-border',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-3xl overflow-hidden', variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
