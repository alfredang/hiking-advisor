import { NextRequest, NextResponse } from 'next/server';
import { mockTrails, searchTrails, filterTrails, getNearbyTrails } from '@/data/mockTrails';
import { Trail } from '@/types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types?: string[];
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

// Convert Google Places result to Trail format
function placeToTrail(place: PlaceResult, index: number): Trail {
  const baseId = `google-${place.place_id.substring(0, 8)}`;

  // Estimate difficulty based on types
  const difficulty: 'easy' | 'moderate' | 'hard' =
    place.types?.includes('natural_feature') ? 'moderate' : 'easy';

  // Get location parts from address
  const addressParts = place.formatted_address.split(', ');
  const country = addressParts[addressParts.length - 1] || 'Unknown';
  const state = addressParts[addressParts.length - 2] || '';
  const city = addressParts[addressParts.length - 3] || addressParts[0] || '';

  return {
    id: baseId,
    name: place.name,
    description: `Discover ${place.name}, a hiking destination in ${place.formatted_address}. Explore this trail and enjoy the natural scenery.`,
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
      distance: 5, // Default estimate
      elevationGain: 200, // Default estimate
      estimatedTime: 120, // Default estimate (2 hours)
      difficulty: difficulty,
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: false,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'Trail information from Google Places - verify locally',
      'Check local conditions before hiking',
      'Bring adequate water and supplies',
    ],
    path: [
      place.geometry.location,
      { lat: place.geometry.location.lat + 0.01, lng: place.geometry.location.lng + 0.01 },
    ],
    images: place.photos?.slice(0, 2).map((photo, i) =>
      `/api/place-photo?query=${encodeURIComponent(place.name)}&cacheKey=${baseId}-${i}&v=2`
    ) || [`/api/place-photo?query=${encodeURIComponent(place.name + ' hiking')}&cacheKey=${baseId}-0&v=2`],
    rating: place.rating || 4.0,
    reviewCount: place.user_ratings_total || 0,
    isGooglePlace: true, // Flag to indicate this came from Google Places
  } as Trail;
}

// Search Google Places for hiking trails
async function searchGooglePlaces(query: string): Promise<Trail[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return [];
  }

  try {
    // Search for hiking trails in the specified location
    const searchQuery = `hiking trails in ${query}`;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=park|natural_feature&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Google Places');
    }

    const data: PlacesResponse = await response.json();

    if (data.status !== 'OK' || !data.results.length) {
      return [];
    }

    // Convert top 10 results to Trail format
    return data.results.slice(0, 10).map((place, index) => placeToTrail(place, index));
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const query = searchParams.get('q') || '';
  const difficulty = searchParams.getAll('difficulty');
  const minDistance = searchParams.get('minDistance');
  const maxDistance = searchParams.get('maxDistance');
  const trailType = searchParams.getAll('trailType');
  const facilities = searchParams.getAll('facilities');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  try {
    let trails = mockTrails;
    let fromGoogle = false;

    // Search by query
    if (query) {
      trails = searchTrails(query);

      // If no curated trails found, search Google Places
      if (trails.length === 0) {
        trails = await searchGooglePlaces(query);
        fromGoogle = true;
      }
    }

    // Get nearby trails if coordinates provided
    if (lat && lng && !fromGoogle) {
      const nearbyTrails = getNearbyTrails(parseFloat(lat), parseFloat(lng), 500);
      if (nearbyTrails.length > 0) {
        trails = nearbyTrails;
      }
    }

    // Apply filters (only for curated trails, not Google results)
    if (!fromGoogle) {
      trails = filterTrails(trails, {
        difficulty: difficulty.length > 0 ? difficulty : undefined,
        minDistance: minDistance ? parseFloat(minDistance) : undefined,
        maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
        trailType: trailType.length > 0 ? trailType : undefined,
        facilities: facilities.length > 0 ? facilities : undefined,
      });
    }

    return NextResponse.json({
      trails,
      total: trails.length,
      source: fromGoogle ? 'google' : 'curated',
    });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
}
