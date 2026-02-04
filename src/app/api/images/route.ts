import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

interface SearchResult {
  link: string;
  image: {
    height: number;
    width: number;
  };
}

interface CustomSearchResponse {
  items?: SearchResult[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'hiking trail';
  const count = parseInt(searchParams.get('count') || '5', 10);

  try {
    const images: string[] = [];

    // Try Google Custom Search if configured
    if (GOOGLE_API_KEY && GOOGLE_SEARCH_ENGINE_ID) {
      const searchQuery = `${query} hiking trail scenery landscape`;
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&imgSize=large&imgType=photo&num=${Math.min(count, 10)}&safe=active`;

      const response = await fetch(searchUrl);

      if (response.ok) {
        const data: CustomSearchResponse = await response.json();

        if (data.items) {
          // Prefer landscape images
          const sortedItems = [...data.items].sort((a, b) => {
            const aIsLandscape = a.image.width > a.image.height ? 1 : 0;
            const bIsLandscape = b.image.width > b.image.height ? 1 : 0;
            return bIsLandscape - aIsLandscape;
          });

          for (const item of sortedItems.slice(0, count)) {
            images.push(item.link);
          }
        }
      }
    }

    // Fallback to Unsplash if no images found
    if (images.length === 0) {
      const unsplashQuery = encodeURIComponent(`${query} hiking nature`);
      for (let i = 0; i < count; i++) {
        // Use different seeds for different images
        images.push(
          `https://source.unsplash.com/800x600/?${unsplashQuery}&sig=${query.substring(0, 5)}-${i}`
        );
      }
    }

    return NextResponse.json({
      images,
      source: GOOGLE_SEARCH_ENGINE_ID ? 'google' : 'unsplash',
    });
  } catch (error) {
    console.error('Error fetching images:', error);

    // Return Unsplash fallback images
    const fallbackImages = [];
    for (let i = 0; i < count; i++) {
      fallbackImages.push(
        `https://source.unsplash.com/800x600/?hiking,trail,nature&sig=fallback-${i}`
      );
    }

    return NextResponse.json({
      images: fallbackImages,
      source: 'fallback',
    });
  }
}
