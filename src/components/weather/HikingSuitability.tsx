'use client';

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUITABILITY_CONFIG } from '@/lib/constants';
import type { HikingSuitability as HikingSuitabilityType } from '@/types';

interface HikingSuitabilityProps {
  suitability: HikingSuitabilityType;
}

const icons = {
  good: CheckCircle,
  caution: AlertTriangle,
  unsafe: XCircle,
};

export function HikingSuitability({ suitability }: HikingSuitabilityProps) {
  const config = SUITABILITY_CONFIG[suitability.status];
  const Icon = icons[suitability.status];

  return (
    <div className={cn('p-3 rounded-lg', config.bgColor)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('h-5 w-5', config.color)} />
        <span className={cn('font-medium', config.color)}>{config.label}</span>
      </div>
      {suitability.reasons.length > 0 && (
        <ul className="space-y-1">
          {suitability.reasons.map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
