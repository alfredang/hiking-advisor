import { NextRequest, NextResponse } from 'next/server';

// This route now strictly proxies Google Places photos to ensure accuracy.
// It mirrors /api/place-photo but keeps backward compatibility for callers.

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceResult {
  place_id: string;
  photos?: PlacePhoto[];
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trailName = searchParams.get('name') || '';
  const placeId = searchParams.get('placeId');
  const count = Math.min(parseInt(searchParams.get('count') || '2', 10), 5);

  if (!GOOGLE_MAPS_API_KEY) {
    return new NextResponse('Google API key not configured', { status: 500 });
  }

  try {
    const images: string[] = [];

    const pushPhotos = (photos: PlacePhoto[], basePlaceId: string) => {
      const sorted = [...photos].sort((a, b) => b.width * b.height - a.width * a.height);
      for (const photo of sorted.slice(0, count)) {
        images.push(`/api/place-photo?photoRef=${encodeURIComponent(photo.photo_reference)}&placeId=${basePlaceId}`);
      }
    };

    // Direct details fetch when placeId provided
    if (placeId) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`;
      const detailsResp = await fetch(detailsUrl);
      if (detailsResp.ok) {
        const detailsData = await detailsResp.json();
        if (detailsData.status === 'OK' && detailsData.result?.photos?.length) {
          pushPhotos(detailsData.result.photos, placeId);
        }
      }
    }

    // Text search fallback by trail name
    if (!images.length && trailName) {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(trailName)}&type=park|natural_feature|tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`;
      const searchResp = await fetch(searchUrl);
      if (searchResp.ok) {
        const searchData: PlacesResponse = await searchResp.json();
        if (searchData.status === 'OK' && searchData.results.length) {
          const best = searchData.results[0];
          if (best.photos?.length) {
            pushPhotos(best.photos, best.place_id);
          }
        }
      }
    }

    if (!images.length) {
      return new NextResponse('No Google Places photo found', { status: 404 });
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching trail image:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
