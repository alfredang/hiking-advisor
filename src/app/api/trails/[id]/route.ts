import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // With fully dynamic data from Google Places API, individual trail lookup by ID
  // is not supported. Trails are fetched dynamically via search or location.
  // The frontend stores selected trail data in the client-side store.

  return NextResponse.json(
    {
      error: 'Trail lookup by ID not available',
      message: 'Use /api/trails with search query or coordinates to find trails',
      requestedId: id
    },
    { status: 404 }
  );
}
