import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceResult {
  place_id: string;
  photos?: PlacePhoto[];
  name: string;
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const placeId = searchParams.get('placeId');
  const count = Math.min(parseInt(searchParams.get('count') || '5', 10), 10);

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ images: [], source: 'none', error: 'Google API key missing' }, { status: 500 });
  }

  try {
    const images: string[] = [];

    // Helper to map photo refs to proxied URLs
    const pushPhotos = (photos: PlacePhoto[], basePlaceId: string) => {
      const sorted = [...photos].sort((a, b) => b.width * b.height - a.width * a.height);
      for (const photo of sorted.slice(0, count)) {
        images.push(`/api/place-photo?photoRef=${encodeURIComponent(photo.photo_reference)}&placeId=${basePlaceId}`);
      }
    };

    // If placeId provided, fetch details directly for authoritative photos
    if (placeId) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name&key=${GOOGLE_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        if (detailsData.status === 'OK' && detailsData.result?.photos?.length) {
          pushPhotos(detailsData.result.photos, placeId);
        }
      }
    }

    // Otherwise run a text search to find the place first
    if (!images.length && query) {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=park|natural_feature|tourist_attraction&key=${GOOGLE_API_KEY}`;
      const response = await fetch(searchUrl);
      if (response.ok) {
        const data: PlacesResponse = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const topPlace = data.results[0];
          if (topPlace.photos?.length) {
            pushPhotos(topPlace.photos, topPlace.place_id);
          } else {
            // Fetch details to try to obtain photos
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${topPlace.place_id}&fields=photos&key=${GOOGLE_API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);
            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();
              if (detailsData.status === 'OK' && detailsData.result?.photos?.length) {
                pushPhotos(detailsData.result.photos, topPlace.place_id);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      images,
      source: 'google-places',
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [], source: 'error' }, { status: 500 });
  }
}
