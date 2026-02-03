'use client';

import { useEffect } from 'react';
import { MapPin, Mountain } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TrailCard } from '@/components/trail/TrailCard';
import { LoadingSkeleton } from '@/components/ui';
import { mockTrails, filterTrails } from '@/data/mockTrails';

export function SearchResults() {
  const { searchResults, setSearchResults, filters, isSearching, selectedTrail, selectTrail, setMapCenter, setActiveView } = useStore();

  // Initialize with all trails on mount and apply filters
  useEffect(() => {
    let results = searchResults.length > 0 ? searchResults : mockTrails;

    // Apply filters
    results = filterTrails(results, {
      difficulty: filters.difficulty.length > 0 ? filters.difficulty : undefined,
      minDistance: filters.distanceRange[0] > 0 ? filters.distanceRange[0] : undefined,
      maxDistance: filters.distanceRange[1] < 50 ? filters.distanceRange[1] : undefined,
      trailType: filters.trailType.length > 0 ? filters.trailType : undefined,
      facilities: filters.facilities.length > 0 ? filters.facilities : undefined,
    });

    setSearchResults(results);
  }, [filters]);

  // Set initial trails if empty
  useEffect(() => {
    if (searchResults.length === 0) {
      setSearchResults(mockTrails);
    }
  }, []);

  const handleTrailClick = (trailId: string) => {
    const trail = searchResults.find((t) => t.id === trailId);
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

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Mountain className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">No trails found</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try adjusting your filters or search for a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{searchResults.length} trails found</span>
        </div>
      </div>

      <div className="space-y-4">
        {searchResults.map((trail) => (
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
