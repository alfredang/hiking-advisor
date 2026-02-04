import { NextRequest, NextResponse } from 'next/server';
import { Trail } from '@/types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: PlacePhoto[];
  types?: string[];
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

// Convert Google Places result to Trail format
function placeToTrail(place: PlaceResult, index: number): Trail {
  const baseId = `place-${place.place_id.substring(0, 12)}`;

  // Estimate difficulty based on types
  let difficulty: 'easy' | 'moderate' | 'hard' = 'moderate';
  if (place.types?.includes('park')) difficulty = 'easy';
  if (place.types?.includes('natural_feature')) difficulty = 'moderate';
  if (place.name.toLowerCase().includes('mountain') || place.name.toLowerCase().includes('peak')) {
    difficulty = 'hard';
  }

  // Get location parts from address
  const addressParts = place.formatted_address.split(', ');
  const country = addressParts[addressParts.length - 1] || 'Unknown';
  const state = addressParts.length > 2 ? addressParts[addressParts.length - 2] : '';
  const city = addressParts.length > 3 ? addressParts[addressParts.length - 3] : addressParts[0] || '';

  // Generate image URLs - use photo_reference from Places API if available
  const images: string[] = [];
  if (place.photos && place.photos.length > 0) {
    // Use actual Google Places photos for this specific place
    for (let i = 0; i < Math.min(2, place.photos.length); i++) {
      const photoRef = place.photos[i].photo_reference;
      images.push(`/api/place-photo?photoRef=${encodeURIComponent(photoRef)}&placeId=${place.place_id}&index=${i}`);
    }
  }

  // If not enough photos, add fallback
  while (images.length < 2) {
    images.push(`/api/place-photo?query=${encodeURIComponent(place.name)}&placeId=${place.place_id}&index=${images.length}`);
  }

  return {
    id: baseId,
    name: place.name,
    description: `Explore ${place.name} located in ${place.formatted_address}. This is a popular hiking destination with beautiful natural scenery.`,
    location: {
      city: city,
      state: state,
      country: country,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    },
    stats: {
      distance: Math.round((3 + Math.random() * 12) * 10) / 10,
      elevationGain: Math.round(50 + Math.random() * 500),
      estimatedTime: Math.round(60 + Math.random() * 180),
      difficulty: difficulty,
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: Math.random() > 0.3,
      waterPoints: Math.random() > 0.5,
      campsites: Math.random() > 0.7,
    },
    safetyNotes: [
      'Check local conditions before visiting',
      'Bring adequate water and supplies',
      'Wear appropriate hiking footwear',
    ],
    path: [
      place.geometry.location,
      { lat: place.geometry.location.lat + 0.005, lng: place.geometry.location.lng + 0.005 },
      { lat: place.geometry.location.lat + 0.01, lng: place.geometry.location.lng },
    ],
    images: images,
    rating: place.rating || 4.0 + Math.random() * 0.9,
    reviewCount: place.user_ratings_total || Math.round(100 + Math.random() * 2000),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: 'API not configured', trails: [] }, { status: 500 });
  }

  try {
    let trails: Trail[] = [];

    if (query) {
      // Search for hiking trails/parks in the specified location
      const searchQuery = `hiking trails ${query}`;
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=park|natural_feature|tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(searchUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        trails = data.results.slice(0, 20).map((place, index) => placeToTrail(place, index));
      }
    } else if (lat && lng) {
      // Search nearby trails
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=park|natural_feature&keyword=hiking+trail&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(nearbyUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        trails = data.results.slice(0, 20).map((place, index) => placeToTrail(place, index));
      }
    } else {
      // Default: show popular hiking destinations
      const defaultUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=popular+hiking+trails+nature+reserve&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(defaultUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        trails = data.results.slice(0, 20).map((place, index) => placeToTrail(place, index));
      }
    }

    return NextResponse.json({
      trails,
      total: trails.length,
    });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json({ error: 'Failed to fetch trails', trails: [] }, { status: 500 });
  }
}
