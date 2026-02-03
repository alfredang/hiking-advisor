import { Trail } from '@/types';

export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'MacRitchie TreeTop Walk',
    description:
      'Singapore\'s most popular nature trail featuring the iconic 250-meter free-standing suspension bridge. Walk through the forest canopy and spot wildlife like long-tailed macaques and flying lemurs.',
    location: {
      city: 'Central Catchment',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.3542, lng: 103.8198 },
    },
    stats: {
      distance: 11,
      elevationGain: 80,
      estimatedTime: 240,
      difficulty: 'moderate',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'TreeTop Walk opens 9am-5pm (last entry 4:45pm)',
      'Closed on Mondays except public holidays',
      'Bring insect repellent',
      'Do not feed the monkeys',
    ],
    path: [
      { lat: 1.3412, lng: 103.8332 },
      { lat: 1.3478, lng: 103.8265 },
      { lat: 1.3542, lng: 103.8198 },
      { lat: 1.3512, lng: 103.8245 },
      { lat: 1.3412, lng: 103.8332 },
    ],
    images: [
      'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    ],
    rating: 4.8,
    reviewCount: 3542,
  },
  {
    id: '2',
    name: 'Bukit Timah Nature Reserve',
    description:
      'Home to Singapore\'s highest natural point at 163.63m. This primary rainforest is one of the few remaining in the world and hosts rich biodiversity including over 840 flowering plant species.',
    location: {
      city: 'Bukit Timah',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.3547, lng: 103.7765 },
    },
    stats: {
      distance: 3.2,
      elevationGain: 163,
      estimatedTime: 90,
      difficulty: 'moderate',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Multiple trail routes available - check map',
      'Steep sections on main summit trail',
      'Watch for cyclists on shared paths',
      'Monkeys present - secure your belongings',
    ],
    path: [
      { lat: 1.3502, lng: 103.7756 },
      { lat: 1.3525, lng: 103.7762 },
      { lat: 1.3547, lng: 103.7765 },
    ],
    images: [
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800',
      'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800',
    ],
    rating: 4.7,
    reviewCount: 2876,
  },
  {
    id: '3',
    name: 'Southern Ridges',
    description:
      'A stunning 10km trail connecting Mount Faber Park, Telok Blangah Hill Park, HortPark, Kent Ridge Park, and Labrador Nature Reserve. Features the iconic Henderson Waves bridge.',
    location: {
      city: 'Southern Singapore',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.2789, lng: 103.8189 },
    },
    stats: {
      distance: 10,
      elevationGain: 120,
      estimatedTime: 210,
      difficulty: 'easy',
      trailType: 'point-to-point',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Best to start early morning or late afternoon',
      'Multiple entry and exit points',
      'Henderson Waves lit up at night',
      'Bring sunscreen for exposed sections',
    ],
    path: [
      { lat: 1.2708, lng: 103.8385 },
      { lat: 1.2756, lng: 103.8278 },
      { lat: 1.2789, lng: 103.8189 },
      { lat: 1.2842, lng: 103.8012 },
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    ],
    rating: 4.9,
    reviewCount: 4123,
  },
  {
    id: '4',
    name: 'Pulau Ubin Chek Jawa',
    description:
      'Explore Singapore\'s offshore island with diverse ecosystems. Chek Jawa wetlands offer mangroves, seagrass lagoon, coral rubble, and coastal forest all in one location.',
    location: {
      city: 'Pulau Ubin',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.4092, lng: 103.9912 },
    },
    stats: {
      distance: 8.5,
      elevationGain: 25,
      estimatedTime: 180,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: false,
      toilets: true,
      waterPoints: true,
      campsites: true,
    },
    safetyNotes: [
      'Take bumboat from Changi Point Ferry Terminal',
      'Rent bicycle on the island',
      'Check tide times for Chek Jawa boardwalk',
      'Bring cash - limited card facilities',
    ],
    path: [
      { lat: 1.4087, lng: 103.9678 },
      { lat: 1.4095, lng: 103.9789 },
      { lat: 1.4092, lng: 103.9912 },
      { lat: 1.4087, lng: 103.9678 },
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    ],
    rating: 4.6,
    reviewCount: 1892,
  },
  {
    id: '5',
    name: 'Green Corridor (Rail Corridor)',
    description:
      'Walk along Singapore\'s former railway line stretching from Tanjong Pagar to Woodlands. A heritage trail with old railway bridges, lush greenery, and historical landmarks.',
    location: {
      city: 'Central Singapore',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.3089, lng: 103.7912 },
    },
    stats: {
      distance: 24,
      elevationGain: 30,
      estimatedTime: 360,
      difficulty: 'easy',
      trailType: 'point-to-point',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Multiple access points along the corridor',
      'Can be done in sections',
      'Mostly flat and suitable for all ages',
      'Some sections may be muddy after rain',
    ],
    path: [
      { lat: 1.2745, lng: 103.8432 },
      { lat: 1.3089, lng: 103.7912 },
      { lat: 1.3512, lng: 103.7689 },
      { lat: 1.4312, lng: 103.7689 },
    ],
    images: [
      'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    ],
    rating: 4.5,
    reviewCount: 2341,
  },
  {
    id: '6',
    name: 'Sungei Buloh Wetland Reserve',
    description:
      'Singapore\'s first ASEAN Heritage Park, famous for migratory birds. Walk through mangroves and observe mudskippers, monitor lizards, and diverse birdlife.',
    location: {
      city: 'Kranji',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.4478, lng: 103.7289 },
    },
    stats: {
      distance: 4,
      elevationGain: 10,
      estimatedTime: 120,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Best for birdwatching Sep-Mar (migratory season)',
      'Bring binoculars for bird watching',
      'Crocodiles present - stay on designated paths',
      'Mosquito repellent essential',
    ],
    path: [
      { lat: 1.4456, lng: 103.7312 },
      { lat: 1.4478, lng: 103.7289 },
      { lat: 1.4489, lng: 103.7256 },
      { lat: 1.4456, lng: 103.7312 },
    ],
    images: [
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    ],
    rating: 4.4,
    reviewCount: 1654,
  },
  {
    id: '7',
    name: 'Coney Island Park',
    description:
      'A rustic island park in northeastern Singapore accessible via bridges. Features beaches, mangroves, and a variety of habitats for wildlife including the endangered Malayan woodpecker.',
    location: {
      city: 'Punggol',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.4156, lng: 103.9189 },
    },
    stats: {
      distance: 5.5,
      elevationGain: 15,
      estimatedTime: 90,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'No shops on island - bring water and snacks',
      'Park closes at 7pm',
      'Cycling allowed on main path',
      'Watch out for wild boars',
    ],
    path: [
      { lat: 1.4123, lng: 103.9145 },
      { lat: 1.4156, lng: 103.9189 },
      { lat: 1.4178, lng: 103.9234 },
      { lat: 1.4123, lng: 103.9145 },
    ],
    images: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
    ],
    rating: 4.5,
    reviewCount: 1234,
  },
  {
    id: '8',
    name: 'Chestnut Nature Park',
    description:
      'Singapore\'s largest nature park with dedicated trails for hikers and mountain bikers. The Southern trail offers a more challenging terrain with undulating paths.',
    location: {
      city: 'Chestnut',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.3789, lng: 103.7812 },
    },
    stats: {
      distance: 8.2,
      elevationGain: 95,
      estimatedTime: 150,
      difficulty: 'moderate',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Separate trails for hikers and bikers',
      'North section easier, South more challenging',
      'Watch for mountain bikers',
      'Trail can be slippery when wet',
    ],
    path: [
      { lat: 1.3756, lng: 103.7798 },
      { lat: 1.3789, lng: 103.7812 },
      { lat: 1.3823, lng: 103.7834 },
      { lat: 1.3756, lng: 103.7798 },
    ],
    images: [
      'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800',
    ],
    rating: 4.3,
    reviewCount: 987,
  },
  {
    id: '9',
    name: 'Labrador Nature Reserve',
    description:
      'A coastal nature reserve with WWII historical relics. Explore tunnels, gun emplacements, and enjoy rocky shores with views of Sentosa and the shipping lanes.',
    location: {
      city: 'Labrador',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.2678, lng: 103.8023 },
    },
    stats: {
      distance: 2.1,
      elevationGain: 35,
      estimatedTime: 60,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Watch out for uneven terrain near historical sites',
      'Rocky shore exploration at low tide only',
      'Connects to Southern Ridges trail',
      'Good for sunset views',
    ],
    path: [
      { lat: 1.2656, lng: 103.8034 },
      { lat: 1.2678, lng: 103.8023 },
      { lat: 1.2689, lng: 103.8012 },
      { lat: 1.2656, lng: 103.8034 },
    ],
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800',
    ],
    rating: 4.4,
    reviewCount: 876,
  },
  {
    id: '10',
    name: 'Fort Canning Park',
    description:
      'A historical hilltop park in the heart of Singapore. Home to archaeological sites, WWII bunkers, and beautiful gardens including the iconic spiral staircase.',
    location: {
      city: 'City Centre',
      state: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.2945, lng: 103.8456 },
    },
    stats: {
      distance: 2.5,
      elevationGain: 48,
      estimatedTime: 60,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Popular photo spot - expect crowds at spiral staircase',
      'Many stairs throughout the park',
      'Guided heritage tours available',
      'Near Dhoby Ghaut MRT',
    ],
    path: [
      { lat: 1.2934, lng: 103.8445 },
      { lat: 1.2945, lng: 103.8456 },
      { lat: 1.2956, lng: 103.8467 },
      { lat: 1.2934, lng: 103.8445 },
    ],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    ],
    rating: 4.6,
    reviewCount: 2345,
  },
];

// Helper function to get trail by ID
export function getTrailById(id: string): Trail | undefined {
  return mockTrails.find((trail) => trail.id === id);
}

// Helper function to search trails
export function searchTrails(query: string): Trail[] {
  const lowercaseQuery = query.toLowerCase();
  return mockTrails.filter(
    (trail) =>
      trail.name.toLowerCase().includes(lowercaseQuery) ||
      trail.location.city.toLowerCase().includes(lowercaseQuery) ||
      trail.location.state.toLowerCase().includes(lowercaseQuery) ||
      trail.description.toLowerCase().includes(lowercaseQuery)
  );
}

// Helper function to filter trails
export function filterTrails(
  trails: Trail[],
  filters: {
    difficulty?: string[];
    minDistance?: number;
    maxDistance?: number;
    trailType?: string[];
    facilities?: string[];
  }
): Trail[] {
  return trails.filter((trail) => {
    // Filter by difficulty
    if (filters.difficulty?.length && !filters.difficulty.includes(trail.stats.difficulty)) {
      return false;
    }

    // Filter by distance
    if (filters.minDistance !== undefined && trail.stats.distance < filters.minDistance) {
      return false;
    }
    if (filters.maxDistance !== undefined && trail.stats.distance > filters.maxDistance) {
      return false;
    }

    // Filter by trail type
    if (filters.trailType?.length && !filters.trailType.includes(trail.stats.trailType)) {
      return false;
    }

    // Filter by facilities
    if (filters.facilities?.length) {
      const hasAllFacilities = filters.facilities.every(
        (facility) => trail.facilities[facility as keyof typeof trail.facilities]
      );
      if (!hasAllFacilities) {
        return false;
      }
    }

    return true;
  });
}

// Get nearby trails based on coordinates
export function getNearbyTrails(lat: number, lng: number, maxDistance = 500): Trail[] {
  return mockTrails
    .map((trail) => ({
      trail,
      distance: calculateDistance(lat, lng, trail.location.coordinates.lat, trail.location.coordinates.lng),
    }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map(({ trail }) => trail);
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
