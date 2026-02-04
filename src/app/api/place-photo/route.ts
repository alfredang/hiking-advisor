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

// Cache for photo references
const photoRefCache = new Map<string, { ref: string; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const cacheKey = searchParams.get('cacheKey') || '';

  if (!query) {
    return new NextResponse('Missing query parameter', { status: 400 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return new NextResponse('API not configured', { status: 500 });
  }

  try {
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
            // Try to find a landscape photo
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
      // Return a placeholder image from picsum
      const seed = Math.abs(hashCode(fullCacheKey));
      const placeholderUrl = `https://picsum.photos/seed/${seed}/800/500`;
      const placeholderResponse = await fetch(placeholderUrl, { redirect: 'follow' });

      if (placeholderResponse.ok) {
        const imageBuffer = await placeholderResponse.arrayBuffer();
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
      return new NextResponse('No photo found', { status: 404 });
    }

    // Fetch the actual photo from Google Places Photo API
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`;
    const photoResponse = await fetch(photoUrl);

    if (!photoResponse.ok) {
      throw new Error('Failed to fetch photo');
    }

    const imageBuffer = await photoResponse.arrayBuffer();
    const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching place photo:', error);

    // Fallback to picsum
    try {
      const seed = Math.abs(hashCode(query + cacheKey));
      const fallbackUrl = `https://picsum.photos/seed/${seed}/800/500`;
      const fallbackResponse = await fetch(fallbackUrl, { redirect: 'follow' });

      if (fallbackResponse.ok) {
        const imageBuffer = await fallbackResponse.arrayBuffer();
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch {
      // Ignore
    }

    return new NextResponse('Failed to fetch photo', { status: 500 });
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
