'use client';

import { useEffect, useMemo } from 'react';
import { MapPin, Mountain } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TrailCard } from '@/components/trail/TrailCard';
import { LoadingSkeleton } from '@/components/ui';
import type { Trail } from '@/types';

// Client-side filter function
function filterTrails(trails: Trail[], options: {
  difficulty?: string[];
  minDistance?: number;
  maxDistance?: number;
  trailType?: string[];
  facilities?: string[];
}): Trail[] {
  return trails.filter((trail) => {
    if (options.difficulty && options.difficulty.length > 0) {
      if (!options.difficulty.includes(trail.stats.difficulty)) return false;
    }
    if (options.minDistance !== undefined && trail.stats.distance < options.minDistance) return false;
    if (options.maxDistance !== undefined && trail.stats.distance > options.maxDistance) return false;
    if (options.trailType && options.trailType.length > 0) {
      if (!options.trailType.includes(trail.stats.trailType)) return false;
    }
    if (options.facilities && options.facilities.length > 0) {
      const hasAllFacilities = options.facilities.every(
        (facility) => trail.facilities[facility as keyof typeof trail.facilities]
      );
      if (!hasAllFacilities) return false;
    }
    return true;
  });
}

export function SearchResults() {
  const { searchResults, filters, isSearching, selectedTrail, selectTrail, setMapCenter, setActiveView } = useStore();

  // Apply filters to search results
  const filteredResults = useMemo(() => {
    return filterTrails(searchResults, {
      difficulty: filters.difficulty.length > 0 ? filters.difficulty : undefined,
      minDistance: filters.distanceRange[0] > 0 ? filters.distanceRange[0] : undefined,
      maxDistance: filters.distanceRange[1] < 50 ? filters.distanceRange[1] : undefined,
      trailType: filters.trailType.length > 0 ? filters.trailType : undefined,
      facilities: filters.facilities.length > 0 ? filters.facilities : undefined,
    });
  }, [searchResults, filters]);

  const handleTrailClick = (trailId: string) => {
    const trail = filteredResults.find((t) => t.id === trailId);
    if (trail) {
      selectTrail(trail);
      setMapCenter(trail.location.coordinates);
      setActiveView('details');
    }
  };

  if (isSearching) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <LoadingSkeleton className="h-40 w-full rounded-lg" />
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Mountain className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">No trails found</h3>
        <p className="text-sm text-gray-500 mb-4">
          {searchResults.length > 0
            ? 'Try adjusting your filters to see more results.'
            : 'Search for trails by location or use your current location.'}
        </p>
      </div>
    );
  }

  const displayedResults = filteredResults.slice(0, 3);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>
            {filteredResults.length} trails found · showing top {displayedResults.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedResults.map((trail) => (
          <TrailCard
            key={trail.id}
            trail={trail}
            isSelected={selectedTrail?.id === trail.id}
            onClick={() => handleTrailClick(trail.id)}
          />
        ))}
      </div>
    </div>
  );
}
