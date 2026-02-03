'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Heart, AlertTriangle, Share2, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistance, formatDuration, formatElevation, formatRating } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { DifficultyBadge } from './DifficultyBadge';
import { TrailFacilities } from './TrailFacilities';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ImageGallery } from '@/components/media/ImageGallery';
import { RecommendedTrails } from '@/components/recommendations/RecommendedTrails';
import { useStore } from '@/store/useStore';
import { TRAIL_TYPE_LABELS } from '@/lib/constants';
import type { Trail } from '@/types';

interface TrailDetailsProps {
  trail: Trail;
}

export function TrailDetails({ trail }: TrailDetailsProps) {
  const { useImperialUnits, toggleFavorite, isFavorite, setTrailWeather, setTrailSuitability, trailWeather, trailSuitability } = useStore();
  const isFav = isFavorite(trail.id);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [trailImages, setTrailImages] = useState<string[]>(trail.images);

  // Fetch images from Google Places when trail changes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/images?query=${encodeURIComponent(trail.name + ' Singapore')}&count=5`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setTrailImages(data.images);
          }
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, [trail.id, trail.name]);

  // Fetch weather when trail changes
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const response = await fetch(
          `/api/weather?lat=${trail.location.coordinates.lat}&lng=${trail.location.coordinates.lng}`
        );
        if (response.ok) {
          const data = await response.json();
          setTrailWeather(data.weather);
          setTrailSuitability(data.suitability);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [trail.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trail.name,
          text: `Check out ${trail.name} - a ${trail.stats.difficulty} trail in ${trail.location.city}, ${trail.location.state}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleGetDirections = () => {
    const { lat, lng } = trail.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Hero image */}
      <div className="relative h-56 -mx-4 -mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trailImages[0] || '/placeholder-trail.jpg'}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <DifficultyBadge difficulty={trail.stats.difficulty} />
          <h1 className="text-2xl font-bold text-white mt-2">{trail.name}</h1>
          <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
            <MapPin className="h-4 w-4" />
            <span>
              {trail.location.city}, {trail.location.state}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Quick actions */}
        <div className="flex gap-2">
          <Button
            variant={isFav ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleFavorite(trail.id)}
            className="flex-1 gap-2"
          >
            <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
            {isFav ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="primary" size="sm" onClick={handleGetDirections} className="flex-1 gap-2">
            <Navigation className="h-4 w-4" />
            Directions
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {formatDistance(trail.stats.distance, useImperialUnits)}
            </div>
            <div className="text-xs text-gray-500">Distance</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-lg font-bold text-gray-900">{formatDuration(trail.stats.estimatedTime)}</div>
            <div className="text-xs text-gray-500">Est. Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {formatElevation(trail.stats.elevationGain, useImperialUnits)}
            </div>
            <div className="text-xs text-gray-500">Elevation</div>
          </div>
        </div>

        {/* Rating & trail type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{formatRating(trail.rating)}</span>
            </div>
            <span className="text-sm text-gray-500">({trail.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <Badge variant="info">{TRAIL_TYPE_LABELS[trail.stats.trailType]}</Badge>
        </div>

        {/* Description */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">About this trail</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{trail.description}</p>
        </div>

        {/* Facilities */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Facilities</h2>
          <TrailFacilities facilities={trail.facilities} showLabels />
        </div>

        {/* Weather */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Current Weather</h2>
          <WeatherCard
            weather={trailWeather}
            suitability={trailSuitability}
            isLoading={isLoadingWeather}
          />
        </div>

        {/* Safety notes */}
        {trail.safetyNotes.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Safety Notes
            </h2>
            <ul className="space-y-2">
              {trail.safetyNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Image gallery */}
        {trailImages.length > 1 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Photos</h2>
            <ImageGallery images={trailImages} trailName={trail.name} />
          </div>
        )}

        {/* Recommendations */}
        <RecommendedTrails currentTrail={trail} />
      </div>
    </div>
  );
}
