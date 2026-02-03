'use client';

import { forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  label?: string;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ min, max, step = 1, value, onChange, formatValue, className, label }, ref) => {
    const getPercent = useCallback(
      (val: number) => ((val - min) / (max - min)) * 100,
      [min, max]
    );

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), value[1] - step);
      onChange([newMin, value[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), value[0] + step);
      onChange([value[0], newMax]);
    };

    const displayMin = formatValue ? formatValue(value[0]) : value[0];
    const displayMax = formatValue ? formatValue(value[1]) : value[1];

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm text-gray-500">
              {displayMin} - {displayMax}
            </span>
          </div>
        )}
        <div className="relative h-6">
          {/* Track */}
          <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />

          {/* Active track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-forest-500 rounded-full"
            style={{
              left: `${getPercent(value[0])}%`,
              width: `${getPercent(value[1]) - getPercent(value[0])}%`,
            }}
          />

          {/* Min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-forest-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          />

          {/* Max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-forest-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
