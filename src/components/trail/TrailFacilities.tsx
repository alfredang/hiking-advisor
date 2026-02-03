'use client';

import { ParkingCircle, Droplets, Tent } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrailFacilities as TrailFacilitiesType } from '@/types';

// Custom toilet icon since lucide doesn't have one
function ToiletIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 12h10a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4v-2a2 2 0 0 1 2-2Z" />
      <path d="M7 12V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      <path d="M12 20v2" />
    </svg>
  );
}

interface TrailFacilitiesProps {
  facilities: TrailFacilitiesType;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

const facilityConfig = {
  parking: { icon: ParkingCircle, label: 'Parking' },
  toilets: { icon: ToiletIcon, label: 'Restrooms' },
  waterPoints: { icon: Droplets, label: 'Water' },
  campsites: { icon: Tent, label: 'Camping' },
};

export function TrailFacilities({ facilities, showLabels = false, size = 'md' }: TrailFacilitiesProps) {
  const availableFacilities = Object.entries(facilities)
    .filter(([, available]) => available)
    .map(([key]) => key as keyof TrailFacilitiesType);

  if (availableFacilities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableFacilities.map((facility) => {
        const config = facilityConfig[facility];
        const Icon = config.icon;

        return (
          <div
            key={facility}
            className={cn(
              'flex items-center gap-1.5 bg-gray-100 rounded-full text-gray-600',
              size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5'
            )}
            title={config.label}
          >
            <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
            {showLabels && <span className={cn('text-xs font-medium', size === 'sm' && 'text-[10px]')}>{config.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
