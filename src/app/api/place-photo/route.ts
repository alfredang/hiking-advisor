import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

interface SearchResult {
  link: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
  };
}

interface CustomSearchResponse {
  items?: SearchResult[];
}

// Cache for image URLs to avoid repeated API calls
const imageCache = new Map<string, { url: string; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const cacheKey = searchParams.get('cacheKey') || '';

  if (!query) {
    return new NextResponse('Missing query parameter', { status: 400 });
  }

  try {
    // Use both query and cacheKey for cache lookup
    const fullCacheKey = `${query.toLowerCase()}-${cacheKey}`;
    const cached = imageCache.get(fullCacheKey);

    let imageUrl: string | null = null;

    if (cached && cached.expires > Date.now()) {
      imageUrl = cached.url;
    } else if (GOOGLE_API_KEY && GOOGLE_SEARCH_ENGINE_ID) {
      // Use Google Custom Search API for images
      const searchQuery = `${query} hiking trail scenery`;
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&imgSize=large&imgType=photo&num=1&safe=active`;

      const response = await fetch(searchUrl);

      if (response.ok) {
        const data: CustomSearchResponse = await response.json();

        if (data.items && data.items.length > 0) {
          // Find a landscape-oriented image
          const landscapeImage = data.items.find(
            (item) => item.image.width > item.image.height
          );
          imageUrl = landscapeImage?.link || data.items[0].link;

          // Cache the result
          imageCache.set(fullCacheKey, {
            url: imageUrl,
            expires: Date.now() + CACHE_TTL,
          });
        }
      }
    }

    // Fallback to Unsplash if Google Search not configured or failed
    if (!imageUrl) {
      const unsplashQuery = encodeURIComponent(`${query} hiking nature trail`);
      // Use Unsplash Source for direct image URL (no API key needed)
      // Adding cacheKey to get different images for different trails
      const seed = cacheKey || query.substring(0, 10);
      imageUrl = `https://source.unsplash.com/800x600/?${unsplashQuery}&sig=${seed}`;

      imageCache.set(fullCacheKey, {
        url: imageUrl,
        expires: Date.now() + CACHE_TTL,
      });
    }

    // Fetch and proxy the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrailFinder/1.0)',
      },
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'X-Image-Source': GOOGLE_SEARCH_ENGINE_ID ? 'google' : 'unsplash',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);

    // Final fallback - return a placeholder hiking image from Unsplash
    try {
      const fallbackUrl = `https://source.unsplash.com/800x600/?hiking,mountain,trail&sig=${Date.now()}`;
      const fallbackResponse = await fetch(fallbackUrl);

      if (fallbackResponse.ok) {
        const imageBuffer = await fallbackResponse.arrayBuffer();
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
            'X-Image-Source': 'fallback',
          },
        });
      }
    } catch {
      // Ignore fallback errors
    }

    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
