'use client';

import { useState } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { mockTrails, getNearbyTrails } from '@/data/mockTrails';

export function SearchBar() {
  const { searchQuery, setSearchQuery, setSearchResults, setMapCenter, setUserLocation, setIsSearching, isSearching } =
    useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = async () => {
    setSearchQuery(localQuery);
    if (localQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/trails?q=${encodeURIComponent(localQuery)}`);
        const data = await response.json();
        setSearchResults(data.trails || []);
        if (data.trails?.length > 0) {
          setMapCenter(data.trails[0].location.coordinates);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults(mockTrails);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setSearchResults(mockTrails);
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });

        // Find nearby trails
        const nearbyTrails = getNearbyTrails(latitude, longitude, 500);
        setSearchResults(nearbyTrails.length > 0 ? nearbyTrails : mockTrails);
        setLocalQuery('Near me');
        setSearchQuery('Near me');
        setIsSearching(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please try searching manually.');
        setIsSearching(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Search trails, parks, or cities..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          icon={<Search className="h-4 w-4" />}
          className="pr-20"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          size="sm"
          onClick={() => void handleSearch()}
          disabled={isSearching}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleUseLocation}
        disabled={isSearching}
        className="w-full gap-2"
      >
        {isSearching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" />
            Use my current location
          </>
        )}
      </Button>
    </div>
  );
}
