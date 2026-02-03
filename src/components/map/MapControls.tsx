'use client';

import { Plus, Minus, Locate, Layers, Maximize } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MapControlsProps {
  map: google.maps.Map | null;
}

export function MapControls({ map }: MapControlsProps) {
  const { userLocation, setUserLocation, setMapCenter } = useStore();
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [isLocating, setIsLocating] = useState(false);

  const handleZoomIn = () => {
    if (map) {
      map.setZoom((map.getZoom() || 10) + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom((map.getZoom() || 10) - 1);
    }
  };

  const handleLocateUser = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        setMapCenter(location);
        if (map) {
          map.setZoom(12);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapTypeChange = () => {
    const types: ('roadmap' | 'satellite' | 'terrain')[] = ['roadmap', 'satellite', 'terrain'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    const nextType = types[nextIndex];
    setMapType(nextType);
    if (map) {
      map.setMapTypeId(nextType);
    }
  };

  const handleFullscreen = () => {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainer.requestFullscreen();
      }
    }
  };

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      {/* Zoom controls */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 transition-colors border-b border-gray-200"
          aria-label="Zoom in"
        >
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Location button */}
      <button
        onClick={handleLocateUser}
        disabled={isLocating}
        className={cn(
          'p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors',
          isLocating && 'animate-pulse'
        )}
        aria-label="Find my location"
      >
        <Locate className={cn('h-5 w-5', userLocation ? 'text-blue-500' : 'text-gray-700')} />
      </button>

      {/* Map type toggle */}
      <button
        onClick={handleMapTypeChange}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Change map type"
        title={`Current: ${mapType}`}
      >
        <Layers className="h-5 w-5 text-gray-700" />
      </button>

      {/* Fullscreen toggle */}
      <button
        onClick={handleFullscreen}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle fullscreen"
      >
        <Maximize className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
}
