'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mockTrails } from '@/data/mockTrails';
import { TrailMarker } from './TrailMarker';
import { MapControls } from './MapControls';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, SELECTED_TRAIL_ZOOM, DIFFICULTY_CONFIG } from '@/lib/constants';
import type { Trail } from '@/types';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export function MapContainer() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const {
    mapCenter,
    mapZoom,
    setMapCenter,
    setMapZoom,
    searchResults,
    selectedTrail,
    selectTrail,
    userLocation,
    setActiveView,
  } = useStore();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hoveredTrail, setHoveredTrail] = useState<Trail | null>(null);

  const trails = searchResults.length > 0 ? searchResults : mockTrails;

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center map on selected trail
  useEffect(() => {
    if (selectedTrail && map) {
      map.panTo(selectedTrail.location.coordinates);
      map.setZoom(SELECTED_TRAIL_ZOOM);
    }
  }, [selectedTrail, map]);

  // Update map center from store
  useEffect(() => {
    if (map && mapCenter) {
      map.panTo(mapCenter);
    }
  }, [mapCenter, map]);

  const handleMarkerClick = (trail: Trail) => {
    selectTrail(trail);
    setMapCenter(trail.location.coordinates);
    setActiveView('details');
  };

  const handleMapClick = () => {
    setHoveredTrail(null);
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors = {
      easy: '#22c55e',
      moderate: '#eab308',
      hard: '#ef4444',
    };
    return colors[difficulty as keyof typeof colors] || '#6b7280';
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-8">
          <p className="text-red-500 font-medium">Failed to load Google Maps</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your API key configuration
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {/* Trail markers */}
        {trails.map((trail) => (
          <Marker
            key={trail.id}
            position={trail.location.coordinates}
            onClick={() => handleMarkerClick(trail)}
            onMouseOver={() => setHoveredTrail(trail)}
            onMouseOut={() => setHoveredTrail(null)}
            icon={{
              path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
              scale: selectedTrail?.id === trail.id ? 1.5 : 1.2,
              fillColor: '#EA4335',
              fillOpacity: 1,
              strokeColor: '#B31412',
              strokeWeight: 1,
              anchor: new google.maps.Point(0, 0),
            }}
          />
        ))}

        {/* Trail path for selected trail */}
        {selectedTrail && selectedTrail.path.length > 1 && (
          <Polyline
            path={selectedTrail.path}
            options={{
              strokeColor: getDifficultyColor(selectedTrail.stats.difficulty),
              strokeWeight: 4,
              strokeOpacity: 0.8,
            }}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
            title="Your location"
          />
        )}

        {/* Info window for hovered trail */}
        {hoveredTrail && !selectedTrail && (
          <InfoWindow
            position={hoveredTrail.location.coordinates}
            onCloseClick={() => setHoveredTrail(null)}
          >
            <TrailMarker trail={hoveredTrail} />
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map controls */}
      <MapControls map={map} />
    </div>
  );
}
