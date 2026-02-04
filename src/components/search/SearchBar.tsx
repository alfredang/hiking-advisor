'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

export function SearchBar() {
  const { searchQuery, setSearchQuery, setSearchResults, setMapCenter, setUserLocation, setIsSearching, isSearching } =
    useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Load default trails on initial mount
  useEffect(() => {
    if (!hasLoadedInitial) {
      setHasLoadedInitial(true);
      void fetchTrails();
    }
  }, [hasLoadedInitial]);

  const fetchTrails = async (query?: string, lat?: number, lng?: number) => {
    setIsSearching(true);
    try {
      let url = '/api/trails';
      const params = new URLSearchParams();

      if (query) {
        params.set('q', query);
      } else if (lat !== undefined && lng !== undefined) {
        params.set('lat', lat.toString());
        params.set('lng', lng.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.trails || []);
      if (data.trails?.length > 0) {
        setMapCenter(data.trails[0].location.coordinates);
      }
    } catch (error) {
      console.error('Failed to fetch trails:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    setSearchQuery(localQuery);
    await fetchTrails(localQuery.trim() || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  const handleClear = async () => {
    setLocalQuery('');
    setSearchQuery('');
    await fetchTrails();
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });

        // Fetch nearby trails from API
        await fetchTrails(undefined, latitude, longitude);
        setLocalQuery('Near me');
        setSearchQuery('Near me');
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
