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
  const query = searchParams.get('query') || 'hiking trail Singapore';
  const count = parseInt(searchParams.get('count') || '5', 10);

  try {
    if (GOOGLE_MAPS_API_KEY) {
      // Use Google Places Text Search to find the place
      const searchResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search places');
      }

      const searchData: PlacesResponse = await searchResponse.json();

      if (searchData.status !== 'OK' || !searchData.results.length) {
        // Fallback to mock images if no results
        return NextResponse.json({ images: getMockImages(count) });
      }

      // Collect photo references from results
      const photoRefs: string[] = [];
      for (const place of searchData.results) {
        if (place.photos) {
          for (const photo of place.photos) {
            photoRefs.push(photo.photo_reference);
            if (photoRefs.length >= count) break;
          }
        }
        if (photoRefs.length >= count) break;
      }

      if (photoRefs.length === 0) {
        return NextResponse.json({ images: getMockImages(count) });
      }

      // Convert photo references to URLs
      const images = photoRefs.slice(0, count).map(
        (ref) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_MAPS_API_KEY}`
      );

      return NextResponse.json({ images });
    }

    // Return mock images if no API key
    return NextResponse.json({ images: getMockImages(count) });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: getMockImages(count) });
  }
}

function getMockImages(count: number): string[] {
  const mockImages = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
  ];
  return mockImages.slice(0, count);
}
