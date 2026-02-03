import { NextRequest, NextResponse } from 'next/server';
import { getTrailById } from '@/data/mockTrails';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const trail = getTrailById(id);

    if (!trail) {
      return NextResponse.json(
        { error: 'Trail not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trail);
  } catch (error) {
    console.error('Error fetching trail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trail' },
      { status: 500 }
    );
  }
}
