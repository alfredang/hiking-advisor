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

interface PlaceDetailsResponse {
  result: {
    photos?: PlacePhoto[];
    formatted_address?: string;
    address_components?: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  };
  status: string;
}

// Extract zip/postal code from address components or formatted address
function extractZipCode(address: string, addressComponents?: { long_name: string; types: string[] }[]): string {
  // Try to get from address components first
  if (addressComponents) {
    const postalComponent = addressComponents.find(c => c.types.includes('postal_code'));
    if (postalComponent) {
      return postalComponent.long_name;
    }
  }

  // Fallback: extract from formatted address using regex
  // Matches common postal code formats (US: 12345, UK: SW1A 1AA, etc.)
  const zipMatch = address.match(/\b\d{5}(-\d{4})?\b|\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b|\b\d{3}-\d{4}\b|\b\d{6}\b/i);
  return zipMatch ? zipMatch[0] : '';
}

// Fetch detailed place info including more photos
async function getPlaceDetails(placeId: string): Promise<PlacePhoto[]> {
  if (!GOOGLE_MAPS_API_KEY) return [];

  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,address_components&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(detailsUrl);
    const data: PlaceDetailsResponse = await response.json();

    if (data.status === 'OK' && data.result.photos) {
      return data.result.photos;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }

  return [];
}

function mergePhotos(primary?: PlacePhoto[], extra?: PlacePhoto[]): PlacePhoto[] {
  const seen = new Set<string>();
  const merged: PlacePhoto[] = [];

  for (const list of [primary || [], extra || []]) {
    for (const photo of list) {
      if (!seen.has(photo.photo_reference)) {
        seen.add(photo.photo_reference);
        merged.push(photo);
      }
    }
  }

  return merged;
}

// Convert Google Places result to Trail format
async function placeToTrail(
  place: PlaceResult,
  index: number,
  detailedPhotos: PlacePhoto[] | undefined,
  usedHeroRefs: Set<string>
): Promise<Trail> {
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

  // Extract zip code for more accurate image search
  const zipCode = extractZipCode(place.formatted_address);

  // Merge photos from search and details to maximize variety
  const photos = mergePhotos(place.photos, detailedPhotos);

  // Generate image URLs - exclusively from Google Places photos. No external placeholders.
  const images: string[] = [];
  if (photos && photos.length > 0) {
    // Prefer highest-resolution photos first
    const sorted = [...photos].sort((a, b) => b.width * b.height - a.width * a.height);

    // Start hero search at an index based on list order to increase variation
    const startOffset = (index * 2) % sorted.length;

    // Pick a hero photo that hasn't been used yet across the page
    let heroRef: string | null = null;
    for (let i = 0; i < sorted.length; i++) {
      const photoIndex = (startOffset + i) % sorted.length;
      const candidate = sorted[photoIndex].photo_reference;
      if (!usedHeroRefs.has(candidate)) {
        heroRef = candidate;
        usedHeroRefs.add(candidate);
        break;
      }
    }
    // Fallback to startOffset if all photos already used
    if (!heroRef) {
      heroRef = sorted[startOffset].photo_reference;
    }

    // Add hero first
    images.push(`/api/place-photo?photoRef=${encodeURIComponent(heroRef)}&placeId=${place.place_id}&trailIndex=${index}&photoIndex=hero`);

    // Add up to two more distinct photos for gallery (skip duplicates)
    for (let i = 0, added = 0; i < sorted.length && added < 2; i++) {
      const photoIndex = (startOffset + i + 1) % sorted.length; // shift by 1 to avoid the same hero position
      const ref = sorted[photoIndex].photo_reference;
      if (ref === heroRef) continue;
      images.push(`/api/place-photo?photoRef=${encodeURIComponent(ref)}&placeId=${place.place_id}&trailIndex=${index}&photoIndex=${photoIndex}`);
      added++;
    }
  }

  // If still missing, return empty array; UI will handle missing with no mock

  return {
    id: baseId,
    placeId: place.place_id,
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
    let places: PlaceResult[] = [];

    if (query) {
      // Search for hiking trails/parks in the specified location
      const searchQuery = `hiking trails ${query}`;
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=park|natural_feature|tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(searchUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        places = data.results.slice(0, 20);
      }
    } else if (lat && lng) {
      // Search nearby trails
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=park|natural_feature&keyword=hiking+trail&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(nearbyUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        places = data.results.slice(0, 20);
      }
    } else {
      // Default: show Singapore hiking trails and nature reserves
      const defaultUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hiking+trails+nature+reserve+Singapore&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(defaultUrl);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        places = data.results.slice(0, 20);
      }
    }

    // Fetch detailed photos for each place (in parallel for speed)
    // Only fetch details for places that don't have enough photos
    const usedHeroRefs = new Set<string>();

    const trailPromises = places.map(async (place, index) => {
      let detailedPhotos: PlacePhoto[] | undefined;

      // If place doesn't have photos or fewer than 3, fetch more from Place Details
      if (!place.photos || place.photos.length < 3) {
        detailedPhotos = await getPlaceDetails(place.place_id);
      }

      return placeToTrail(place, index, detailedPhotos, usedHeroRefs);
    });

    const trails = await Promise.all(trailPromises);

    return NextResponse.json({
      trails,
      total: trails.length,
    });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json({ error: 'Failed to fetch trails', trails: [] }, { status: 500 });
  }
}
