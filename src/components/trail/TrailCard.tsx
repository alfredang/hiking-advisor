'use client';

import { MapPin, Clock, TrendingUp, Star, Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistance, formatDuration, formatElevation, formatRating } from '@/lib/utils';
import { Card } from '@/components/ui';
import { DifficultyBadge } from './DifficultyBadge';
import { TrailFacilities } from './TrailFacilities';
import { useStore } from '@/store/useStore';
import { TRAIL_TYPE_LABELS } from '@/lib/constants';
import type { Trail } from '@/types';

interface TrailCardProps {
  trail: Trail;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TrailCard({ trail, isSelected, onClick }: TrailCardProps) {
  const { useImperialUnits, toggleFavorite, isFavorite } = useStore();
  const isFav = isFavorite(trail.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(trail.id);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trail.name)}&query_place_id=${encodeURIComponent(trail.placeId || '')}`;

  return (
    <Card
      variant="bordered"
      padding="none"
      className={cn(
        'overflow-hidden cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-forest-500'
      )}
      onClick={onClick}
    >
      {/* Compact header with difficulty & favorite */}
      <div className="flex items-center justify-between px-4 pt-3">
        <DifficultyBadge difficulty={trail.stats.difficulty} size="sm" />
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'p-2 rounded-full transition-colors',
            isFav ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{trail.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1">
                  {trail.location.city}, {trail.location.state}
                </span>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700"
            >
              Maps <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <span className="font-medium">{formatDistance(trail.stats.distance, useImperialUnits)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(trail.stats.estimatedTime)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{formatElevation(trail.stats.elevationGain, useImperialUnits)}</span>
          </div>
        </div>

        {/* Trail type & rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {TRAIL_TYPE_LABELS[trail.stats.trailType]}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{formatRating(trail.rating)}</span>
            <span className="text-xs text-gray-400">({trail.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Facilities */}
        <TrailFacilities facilities={trail.facilities} size="sm" />
      </div>
    </Card>
  );
}
