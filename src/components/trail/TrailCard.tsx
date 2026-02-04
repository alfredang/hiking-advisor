'use client';

import Image from 'next/image';
import { MapPin, Clock, TrendingUp, Star, Heart } from 'lucide-react';
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
      {/* Image */}
      <div className="relative h-40 bg-gray-200">
        <Image
          src={trail.images[0] || '/placeholder-trail.jpg'}
          alt={trail.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 384px"
          unoptimized
        />
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors',
            isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
          )}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
        </button>
        <div className="absolute bottom-2 left-2">
          <DifficultyBadge difficulty={trail.stats.difficulty} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{trail.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">
              {trail.location.city}, {trail.location.state}
            </span>
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
