'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  description?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-5 w-5 rounded border-2 transition-colors flex items-center justify-center',
              checked ? 'bg-forest-600 border-forest-600' : 'bg-white border-gray-300 hover:border-forest-400'
            )}
          >
            {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
