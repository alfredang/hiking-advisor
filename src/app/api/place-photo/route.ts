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

// Helper function to fetch and proxy fallback images
async function fetchFallbackImage(query: string): Promise<NextResponse> {
  try {
    const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(query)}/800/600`;
    const response = await fetch(fallbackUrl, { redirect: 'follow' });

    if (!response.ok) {
      throw new Error('Failed to fetch fallback image');
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    // Return a simple placeholder as last resort
    return new NextResponse(null, { status: 404 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const maxWidth = searchParams.get('maxwidth') || '800';

  if (!query) {
    return new NextResponse('Missing query parameter', { status: 400 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    // Fetch and proxy fallback image
    return fetchFallbackImage(query);
  }

  try {
    // Check cache first
    const cacheKey = query.toLowerCase();
    const cached = photoRefCache.get(cacheKey);

    let photoRef: string | null = null;

    if (cached && cached.expires > Date.now()) {
      photoRef = cached.ref;
    } else {
      // Search for the place
      const searchResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search places');
      }

      const searchData: PlacesResponse = await searchResponse.json();

      if (searchData.status === 'OK' && searchData.results.length > 0) {
        // Find the first result with photos
        for (const place of searchData.results) {
          if (place.photos && place.photos.length > 0) {
            photoRef = place.photos[0].photo_reference;
            // Cache the photo reference
            photoRefCache.set(cacheKey, {
              ref: photoRef,
              expires: Date.now() + CACHE_TTL,
            });
            break;
          }
        }
      }
    }

    if (!photoRef) {
      // No photo found, use fallback
      return fetchFallbackImage(query);
    }

    // Fetch the actual photo and proxy it
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`;

    const photoResponse = await fetch(photoUrl);

    if (!photoResponse.ok) {
      throw new Error('Failed to fetch photo');
    }

    // Get the image data
    const imageBuffer = await photoResponse.arrayBuffer();
    const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';

    // Return the image with caching headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching place photo:', error);
    // Fallback to picsum
    return fetchFallbackImage(query);
  }
}
