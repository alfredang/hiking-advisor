import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
}

// Hiking-specific search terms based on trail characteristics
function getHikingSearchTerm(difficulty: string, country: string, index: number): string {
  // Curated hiking-specific search terms that Pexels has good results for
  const hikingTerms = [
    'hiking trail forest',
    'mountain hiking path',
    'nature trail walking',
    'forest hiking',
    'mountain landscape trail',
    'scenic hiking',
    'wilderness trail',
    'hiking adventure nature',
    'mountain path hiking',
    'forest path nature',
    'hiking mountains scenic',
    'trail nature walking',
    'outdoor hiking trail',
    'mountain hiking scenic',
    'nature walk forest',
  ];

  // Different terms by difficulty
  const difficultyTerms: Record<string, string[]> = {
    easy: ['nature walk', 'forest path', 'peaceful trail', 'garden path'],
    moderate: ['hiking trail', 'mountain path', 'scenic trail', 'nature hike'],
    hard: ['mountain summit', 'alpine hiking', 'mountain peak', 'rocky trail'],
  };

  // Use combination of index and difficulty for variety
  const baseTerms = difficultyTerms[difficulty] || difficultyTerms['moderate'];
  const baseTerm = baseTerms[index % baseTerms.length];
  const hikingTerm = hikingTerms[(index + difficulty.length) % hikingTerms.length];

  // Combine for more specific search
  return index % 2 === 0 ? baseTerm : hikingTerm;
}

// Simple hash for consistent results
function hashString(str: string): number {
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
  const trailName = searchParams.get('name') || 'hiking trail';
  const country = searchParams.get('country') || '';
  const difficulty = searchParams.get('difficulty') || 'moderate';
  const index = parseInt(searchParams.get('index') || '0', 10);
  const trailId = searchParams.get('id') || trailName;

  try {
    // Create unique hash for this trail
    const trailHash = hashString(trailId + trailName);

    // Get hiking-specific search term
    const searchQuery = getHikingSearchTerm(difficulty, country, index + trailHash);

    // Use different page based on trail hash for variety
    const page = (trailHash % 15) + 1;

    if (PEXELS_API_KEY) {
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15&page=${page}&orientation=landscape`;

      const response = await fetch(pexelsUrl, {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      });

      if (response.ok) {
        const data: PexelsResponse = await response.json();

        if (data.photos && data.photos.length > 0) {
          // Select image based on combined hash for uniqueness
          const imageIndex = (trailHash + index) % data.photos.length;
          const photo = data.photos[imageIndex];

          // Fetch and proxy the image
          const imageResponse = await fetch(photo.src.large);
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            return new NextResponse(imageBuffer, {
              headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
              },
            });
          }
        }
      }
    }

    // Fallback: Use picsum with hiking-themed seed
    // Use a hiking-specific ID range that tends to have nature images
    const natureSeed = 100 + (hashString(trailId + index.toString()) % 900);
    const picsumUrl = `https://picsum.photos/seed/hiking${natureSeed}/800/500`;

    const picsumResponse = await fetch(picsumUrl, { redirect: 'follow' });

    if (picsumResponse.ok) {
      const imageBuffer = await picsumResponse.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error fetching trail image:', error);

    // Final fallback with unique seed
    const seed = hashString(trailId + index.toString());
    return NextResponse.redirect(`https://picsum.photos/seed/trail${seed}/800/500`, { status: 302 });
  }
}
