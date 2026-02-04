'use client';

import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { TrailCard } from '@/components/trail/TrailCard';
import { useStore } from '@/store/useStore';
import type { Trail } from '@/types';

interface RecommendedTrailsProps {
  currentTrail: Trail;
}

export function RecommendedTrails({ currentTrail }: RecommendedTrailsProps) {
  const { selectTrail, setMapCenter, setActiveView, trailSuitability, searchResults } = useStore();

  const recommendations = useMemo(() => {
    // Filter out current trail and find similar ones from search results
    const otherTrails = searchResults.filter((t) => t.id !== currentTrail.id);

    // Score trails based on similarity
    const scored = otherTrails.map((trail) => {
      let score = 0;

      // Same difficulty = +3 points
      if (trail.stats.difficulty === currentTrail.stats.difficulty) {
        score += 3;
      }

      // Similar distance (within 5km) = +2 points
      const distanceDiff = Math.abs(trail.stats.distance - currentTrail.stats.distance);
      if (distanceDiff <= 5) {
        score += 2;
      }

      // Same state = +2 points
      if (trail.location.state === currentTrail.location.state) {
        score += 2;
      }

      // Same trail type = +1 point
      if (trail.stats.trailType === currentTrail.stats.trailType) {
        score += 1;
      }

      // If current weather is bad and this trail is easier, boost score
      if (trailSuitability?.status === 'caution' || trailSuitability?.status === 'unsafe') {
        if (
          trail.stats.difficulty === 'easy' ||
          (trail.stats.difficulty === 'moderate' && currentTrail.stats.difficulty === 'hard')
        ) {
          score += 2;
        }
      }

      // Higher rating = more points
      score += trail.rating;

      return { trail, score };
    });

    // Sort by score and return top 3
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.trail);
  }, [currentTrail, trailSuitability, searchResults]);

  const handleTrailClick = (trail: Trail) => {
    selectTrail(trail);
    setMapCenter(trail.location.coordinates);
    setActiveView('details');
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-forest-600" />
        Similar Trails
        {(trailSuitability?.status === 'caution' || trailSuitability?.status === 'unsafe') && (
          <span className="text-xs font-normal text-gray-500">(weather-adjusted)</span>
        )}
      </h2>
      <div className="space-y-4">
        {recommendations.map((trail) => (
          <TrailCard
            key={trail.id}
            trail={trail}
            onClick={() => handleTrailClick(trail)}
          />
        ))}
      </div>
    </div>
  );
}
