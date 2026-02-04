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

// Simple hash for unique fallback seeds
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const photoRef = searchParams.get('photoRef');
  const query = searchParams.get('query');
  const placeId = searchParams.get('placeId') || '';
  const index = searchParams.get('index') || '0';

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return new NextResponse('API not configured', { status: 500 });
  }

  try {
    let photoReference: string | null = photoRef;

    // If we have a direct photo reference, use it
    if (photoReference) {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
      const photoResponse = await fetch(photoUrl);

      if (photoResponse.ok) {
        const imageBuffer = await photoResponse.arrayBuffer();
        const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        });
      }
    }

    // Fallback: search for the place if we have a query
    if (query) {
      const searchResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (searchResponse.ok) {
        const searchData: PlacesResponse = await searchResponse.json();

        if (searchData.status === 'OK' && searchData.results.length > 0) {
          // Find a result with photos
          for (const place of searchData.results) {
            if (place.photos && place.photos.length > 0) {
              // Use different photo based on index for variety
              const photoIndex = parseInt(index, 10) % place.photos.length;
              photoReference = place.photos[photoIndex].photo_reference;

              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
              const photoResponse = await fetch(photoUrl);

              if (photoResponse.ok) {
                const imageBuffer = await photoResponse.arrayBuffer();
                const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';

                return new NextResponse(imageBuffer, {
                  headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                  },
                });
              }
              break;
            }
          }
        }
      }
    }

    // Final fallback: hiking-themed placeholder
    const seed = Math.abs(hashCode(placeId + query + index));
    const picsumUrl = `https://picsum.photos/seed/trail${seed}/800/500`;
    const fallbackResponse = await fetch(picsumUrl, { redirect: 'follow' });

    if (fallbackResponse.ok) {
      const imageBuffer = await fallbackResponse.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new NextResponse('No photo found', { status: 404 });
  } catch (error) {
    console.error('Error fetching place photo:', error);

    // Error fallback
    const seed = Math.abs(hashCode((query || placeId) + index));
    return NextResponse.redirect(`https://picsum.photos/seed/hiking${seed}/800/500`, { status: 302 });
  }
}
