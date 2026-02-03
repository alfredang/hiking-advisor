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
        return NextResponse.json({ images: getMockImages(query, count) });
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
        return NextResponse.json({ images: getMockImages(query, count) });
      }

      // Fetch the actual image URLs by following redirects
      const imagePromises = photoRefs.slice(0, count).map(async (ref) => {
        try {
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_MAPS_API_KEY}`;
          // Fetch to get the redirect URL
          const response = await fetch(photoUrl, { redirect: 'manual' });
          const redirectUrl = response.headers.get('location');
          return redirectUrl || photoUrl;
        } catch {
          return null;
        }
      });

      const images = (await Promise.all(imagePromises)).filter(Boolean) as string[];

      if (images.length > 0) {
        return NextResponse.json({ images });
      }
    }

    // Return mock images if no API key or failed
    return NextResponse.json({ images: getMockImages(query, count) });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: getMockImages(query, count) });
  }
}

function getMockImages(query: string, count: number): string[] {
  const lowerQuery = query.toLowerCase();

  // Singapore-specific trail images from Wikimedia Commons (public domain / CC)
  const trailImages: Record<string, string[]> = {
    'macritchie': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/TreeTopWalk.JPG/1280px-TreeTopWalk.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Singapore_Botanic_Gardens%2C_Pair_Bond_Bridge%2C_Dec_05.JPG/1280px-Singapore_Botanic_Gardens%2C_Pair_Bond_Bridge%2C_Dec_05.JPG',
    ],
    'bukit timah': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bukit_Timah_Nature_Reserve.jpg/1280px-Bukit_Timah_Nature_Reserve.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bukit_Timah_Hill_Summit.jpg/1280px-Bukit_Timah_Hill_Summit.jpg',
    ],
    'southern ridges': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Henderson_Waves_4%2C_Nov_06.JPG/1280px-Henderson_Waves_4%2C_Nov_06.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/The_Southern_Ridges%2C_Singapore_-_20110506-01.jpg/1280px-The_Southern_Ridges%2C_Singapore_-_20110506-01.jpg',
    ],
    'henderson': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Henderson_Waves_4%2C_Nov_06.JPG/1280px-Henderson_Waves_4%2C_Nov_06.JPG',
    ],
    'pulau ubin': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chek_Jawa_Wetlands_Boardwalk.jpg/1280px-Chek_Jawa_Wetlands_Boardwalk.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Pulau_Ubin_-_panoramio_%281%29.jpg/1280px-Pulau_Ubin_-_panoramio_%281%29.jpg',
    ],
    'chek jawa': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chek_Jawa_Wetlands_Boardwalk.jpg/1280px-Chek_Jawa_Wetlands_Boardwalk.jpg',
    ],
    'rail corridor': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Rail_Corridor_%28Central%29_-_Singapore_%2850067879908%29.jpg/1280px-Rail_Corridor_%28Central%29_-_Singapore_%2850067879908%29.jpg',
    ],
    'green corridor': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Rail_Corridor_%28Central%29_-_Singapore_%2850067879908%29.jpg/1280px-Rail_Corridor_%28Central%29_-_Singapore_%2850067879908%29.jpg',
    ],
    'sungei buloh': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sungei_Buloh_Wetland_Reserve_1.jpg/1280px-Sungei_Buloh_Wetland_Reserve_1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Sungei_Buloh.jpg/1280px-Sungei_Buloh.jpg',
    ],
    'coney island': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coney_Island_Park_Singapore_beach.jpg/1280px-Coney_Island_Park_Singapore_beach.jpg',
    ],
    'chestnut': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bukit_Timah_Nature_Reserve.jpg/1280px-Bukit_Timah_Nature_Reserve.jpg',
    ],
    'labrador': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Labrador_Park_2%2C_Nov_06.JPG/1280px-Labrador_Park_2%2C_Nov_06.JPG',
    ],
    'fort canning': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fort_Canning_Park_5%2C_Singapore%2C_Jan_07.JPG/1280px-Fort_Canning_Park_5%2C_Singapore%2C_Jan_07.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Fort_Canning_Tunnel.jpg/1280px-Fort_Canning_Tunnel.jpg',
    ],
  };

  // Find matching images for the query
  for (const [key, images] of Object.entries(trailImages)) {
    if (lowerQuery.includes(key)) {
      return images.slice(0, count);
    }
  }

  // Default Singapore nature images
  const defaultImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/TreeTopWalk.JPG/1280px-TreeTopWalk.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Henderson_Waves_4%2C_Nov_06.JPG/1280px-Henderson_Waves_4%2C_Nov_06.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bukit_Timah_Nature_Reserve.jpg/1280px-Bukit_Timah_Nature_Reserve.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sungei_Buloh_Wetland_Reserve_1.jpg/1280px-Sungei_Buloh_Wetland_Reserve_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fort_Canning_Park_5%2C_Singapore%2C_Jan_07.JPG/1280px-Fort_Canning_Park_5%2C_Singapore%2C_Jan_07.JPG',
  ];

  return defaultImages.slice(0, count);
}
