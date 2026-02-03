import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'hiking trail';
  const count = parseInt(searchParams.get('count') || '5', 10);

  try {
    if (UNSPLASH_ACCESS_KEY) {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results.map((photo: { urls: { regular: string } }) => photo.urls.regular);

      return NextResponse.json({ images });
    }

    // Return mock images if no API key
    const mockImages = [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
    ];

    return NextResponse.json({ images: mockImages.slice(0, count) });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
