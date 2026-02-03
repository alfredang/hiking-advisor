'use client';

import { MapPin, Clock } from 'lucide-react';
import { formatDistance, formatDuration } from '@/lib/utils';
import { DifficultyBadge } from '@/components/trail/DifficultyBadge';
import { useStore } from '@/store/useStore';
import type { Trail } from '@/types';

interface TrailMarkerProps {
  trail: Trail;
}

export function TrailMarker({ trail }: TrailMarkerProps) {
  const { useImperialUnits } = useStore();

  return (
    <div className="p-2 min-w-[200px]">
      <div className="space-y-2">
        <DifficultyBadge difficulty={trail.stats.difficulty} size="sm" />
        <h3 className="font-semibold text-gray-900 text-sm">{trail.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>
            {trail.location.city}, {trail.location.state}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{formatDistance(trail.stats.distance, useImperialUnits)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(trail.stats.estimatedTime)}
          </span>
        </div>
      </div>
    </div>
  );
}
