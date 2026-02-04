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
  error?: {
    message: string;
  };
}

// Cache for image URLs to avoid repeated API calls
const imageCache = new Map<string, { url: string; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// Generate a consistent seed from a string for reproducible "random" images
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

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
      const searchQuery = `${query} hiking trail nature scenery`;
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&imgSize=large&imgType=photo&num=3&safe=active`;

      console.log('Searching Google Custom Search for:', searchQuery);

      const response = await fetch(searchUrl);
      const data: CustomSearchResponse = await response.json();

      if (data.error) {
        console.error('Google Custom Search error:', data.error.message);
      } else if (data.items && data.items.length > 0) {
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

        console.log('Found Google image:', imageUrl);
      }
    }

    // Fallback to picsum.photos (reliable placeholder service)
    if (!imageUrl) {
      // Use hash of query+cacheKey for consistent but different images per trail
      const seed = hashCode(fullCacheKey);
      imageUrl = `https://picsum.photos/seed/${seed}/800/500`;
      console.log('Using picsum fallback with seed:', seed);

      imageCache.set(fullCacheKey, {
        url: imageUrl,
        expires: Date.now() + CACHE_TTL,
      });
    }

    // Fetch and proxy the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrailFinder/1.0)',
        'Accept': 'image/*',
      },
      redirect: 'follow',
    });

    if (!imageResponse.ok) {
      console.error('Failed to fetch image from:', imageUrl, 'Status:', imageResponse.status);
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'X-Image-Source': GOOGLE_SEARCH_ENGINE_ID && imageUrl.includes('google') ? 'google' : 'picsum',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);

    // Final fallback - use picsum with timestamp
    try {
      const seed = hashCode(query + cacheKey + 'fallback');
      const fallbackUrl = `https://picsum.photos/seed/${seed}/800/500`;
      const fallbackResponse = await fetch(fallbackUrl, { redirect: 'follow' });

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
