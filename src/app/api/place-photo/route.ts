import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceResult {
  photos?: PlacePhoto[];
  name: string;
  place_id: string;
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

// Cache for photo references to avoid repeated API calls
const photoRefCache = new Map<string, { ref: string; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const cacheKey = searchParams.get('cacheKey') || '';
  const maxWidth = searchParams.get('maxwidth') || '800';

  if (!query) {
    return new NextResponse('Missing query parameter', { status: 400 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return new NextResponse('API not configured', { status: 500 });
  }

  try {
    // Use both query and cacheKey for cache lookup to ensure uniqueness
    const fullCacheKey = `${query.toLowerCase()}-${cacheKey}`;
    const cached = photoRefCache.get(fullCacheKey);

    let photoRef: string | null = null;

    if (cached && cached.expires > Date.now()) {
      photoRef = cached.ref;
    } else {
      // Search for the place using Google Places Text Search
      const searchResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search places');
      }

      const searchData: PlacesResponse = await searchResponse.json();

      if (searchData.status === 'OK' && searchData.results.length > 0) {
        // Find a result with photos, preferring landscape-oriented photos
        for (const place of searchData.results) {
          if (place.photos && place.photos.length > 0) {
            // Try to find a landscape photo (width > height)
            const landscapePhoto = place.photos.find(p => p.width > p.height);
            photoRef = landscapePhoto?.photo_reference || place.photos[0].photo_reference;

            // Cache the photo reference
            photoRefCache.set(fullCacheKey, {
              ref: photoRef,
              expires: Date.now() + CACHE_TTL,
            });
            break;
          }
        }
      }
    }

    if (!photoRef) {
      return new NextResponse('No photo found for this location', { status: 404 });
    }

    // Fetch the actual photo from Google Places Photo API
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`;

    const photoResponse = await fetch(photoUrl);

    if (!photoResponse.ok) {
      throw new Error('Failed to fetch photo');
    }

    // Get the image data and proxy it
    const imageBuffer = await photoResponse.arrayBuffer();
    const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Vary': 'Accept-Encoding',
        'X-Query': query.substring(0, 50),
      },
    });
  } catch (error) {
    console.error('Error fetching place photo:', error);
    return new NextResponse('Failed to fetch photo', { status: 500 });
  }
}
