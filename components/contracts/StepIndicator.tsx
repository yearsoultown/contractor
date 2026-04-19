import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  key: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: string;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="hidden sm:flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <span className={cn('font-medium', s.key === current ? 'text-brand-blue' : 'text-slate-400')}>
            {i + 1}. {s.label}
          </span>
          {i < steps.length - 1 && <ChevronRight size={14} className="text-slate-300" />}
        </React.Fragment>
      ))}
    </div>
  );
}