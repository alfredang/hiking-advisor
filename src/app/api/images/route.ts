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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'hiking trail';
  const count = parseInt(searchParams.get('count') || '5', 10);

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return NextResponse.json({ images: [], error: 'API not configured' }, { status: 500 });
  }

  try {
    // Search for the place using Google Places Text Search
    const searchResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search places');
    }

    const searchData: PlacesResponse = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.results.length) {
      return NextResponse.json({ images: [], error: 'No results found' });
    }

    // Collect photo references from results, preferring landscape photos
    const photoRefs: string[] = [];
    for (const place of searchData.results) {
      if (place.photos) {
        for (const photo of place.photos) {
          // Prefer landscape-oriented photos
          if (photo.width > photo.height) {
            photoRefs.push(photo.photo_reference);
          }
          if (photoRefs.length >= count) break;
        }
        // If not enough landscape photos, add any photos
        if (photoRefs.length < count) {
          for (const photo of place.photos) {
            if (!photoRefs.includes(photo.photo_reference)) {
              photoRefs.push(photo.photo_reference);
            }
            if (photoRefs.length >= count) break;
          }
        }
      }
      if (photoRefs.length >= count) break;
    }

    if (photoRefs.length === 0) {
      return NextResponse.json({ images: [], error: 'No photos found' });
    }

    // Convert photo references to actual URLs by following redirects
    const imagePromises = photoRefs.slice(0, count).map(async (ref) => {
      try {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_MAPS_API_KEY}`;
        // Fetch to get the redirect URL (Google Places Photo API redirects to the actual image)
        const response = await fetch(photoUrl, { redirect: 'manual' });
        const redirectUrl = response.headers.get('location');
        return redirectUrl || photoUrl;
      } catch {
        return null;
      }
    });

    const images = (await Promise.all(imagePromises)).filter(Boolean) as string[];

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [], error: 'Failed to fetch images' }, { status: 500 });
  }
}
