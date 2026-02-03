import { NextRequest, NextResponse } from 'next/server';
import { mockTrails, searchTrails, filterTrails, getNearbyTrails } from '@/data/mockTrails';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const query = searchParams.get('q') || '';
  const difficulty = searchParams.getAll('difficulty');
  const minDistance = searchParams.get('minDistance');
  const maxDistance = searchParams.get('maxDistance');
  const trailType = searchParams.getAll('trailType');
  const facilities = searchParams.getAll('facilities');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  try {
    let trails = mockTrails;

    // Search by query
    if (query) {
      trails = searchTrails(query);
    }

    // Get nearby trails if coordinates provided
    if (lat && lng) {
      const nearbyTrails = getNearbyTrails(parseFloat(lat), parseFloat(lng), 500);
      if (nearbyTrails.length > 0) {
        trails = nearbyTrails;
      }
    }

    // Apply filters
    trails = filterTrails(trails, {
      difficulty: difficulty.length > 0 ? difficulty : undefined,
      minDistance: minDistance ? parseFloat(minDistance) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      trailType: trailType.length > 0 ? trailType : undefined,
      facilities: facilities.length > 0 ? facilities : undefined,
    });

    return NextResponse.json({
      trails,
      total: trails.length,
    });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
}
