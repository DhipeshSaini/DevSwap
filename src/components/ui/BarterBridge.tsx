import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowLeftRight } from 'lucide-react';

interface BarterBridgeProps {
  offering: {
    title: string;
    icon: React.ReactNode;
    label?: string;
  };
  requesting: {
    title: string;
    icon: React.ReactNode;
    label?: string;
  };
  className?: string;
}

export function BarterBridge({ offering, requesting, className }: BarterBridgeProps) {
  return (
    <div className={cn('glass-effect p-6 rounded-3xl ghost-border ambient-shadow w-full', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
            {offering.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
              {offering.label || 'Skill Offered'}
            </p>
            <p className="font-headline font-bold text-sm">{offering.title}</p>
          </div>
        </div>

        <div className="flex-1 px-4 hidden sm:block">
          <div className="h-[2px] w-full bg-gradient-to-r from-primary via-primary/50 to-tertiary rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 w-1/3 animate-pulse" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
              <ArrowLeftRight className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="sm:hidden">
             <ArrowLeftRight className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
              {requesting.label || 'Seeking'}
            </p>
            <p className="font-headline font-bold text-sm">{requesting.title}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary">
            {requesting.icon}
          </div>
        </div>
      </div>
    </div>
  );
}
