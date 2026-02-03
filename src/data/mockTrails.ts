import { Trail } from '@/types';

// Using picsum.photos for reliable placeholder images with Singapore trail themes
// In production, these would be replaced with actual trail photos from a CDN
const getTrailImage = (_id: number, seed: string) =>
  `https://picsum.photos/seed/${seed}/800/600`;

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
      getTrailImage(1, 'macritchie-forest'),
      getTrailImage(1, 'macritchie-bridge'),
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
      getTrailImage(2, 'bukittimah-jungle'),
      getTrailImage(2, 'bukittimah-summit'),
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
      getTrailImage(3, 'henderson-waves'),
      getTrailImage(3, 'southern-ridges-view'),
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
      getTrailImage(4, 'chekjawa-boardwalk'),
      getTrailImage(4, 'pulau-ubin-nature'),
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
      getTrailImage(5, 'rail-corridor-green'),
      getTrailImage(5, 'rail-corridor-bridge'),
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
      getTrailImage(6, 'sungei-buloh-wetland'),
      getTrailImage(6, 'sungei-buloh-birds'),
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
      getTrailImage(7, 'coney-island-beach'),
      getTrailImage(7, 'coney-island-path'),
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
      getTrailImage(8, 'chestnut-nature-trail'),
      getTrailImage(8, 'chestnut-forest'),
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
      getTrailImage(9, 'labrador-coastal'),
      getTrailImage(9, 'labrador-nature'),
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
      getTrailImage(10, 'fort-canning-garden'),
      getTrailImage(10, 'fort-canning-stairs'),
    ],
    rating: 4.6,
    reviewCount: 2345,
  },
  // Malaysian Trails
  {
    id: '11',
    name: 'Mount Kinabalu',
    description:
      'Southeast Asia\'s highest peak at 4,095m. A UNESCO World Heritage Site with incredible biodiversity. The challenging 2-day climb rewards hikers with stunning sunrise views above the clouds.',
    location: {
      city: 'Ranau',
      state: 'Sabah',
      country: 'Malaysia',
      coordinates: { lat: 6.0753, lng: 116.5584 },
    },
    stats: {
      distance: 17,
      elevationGain: 2200,
      estimatedTime: 1440,
      difficulty: 'hard',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: true,
    },
    safetyNotes: [
      'Permit required - book months in advance',
      'Mandatory guide required',
      'Altitude sickness possible above 3000m',
      'Best climbed March-April or Sept-Oct',
    ],
    path: [
      { lat: 6.0322, lng: 116.5389 },
      { lat: 6.0542, lng: 116.5486 },
      { lat: 6.0753, lng: 116.5584 },
    ],
    images: [
      getTrailImage(11, 'kinabalu-summit'),
      getTrailImage(11, 'kinabalu-trail'),
    ],
    rating: 4.9,
    reviewCount: 8765,
  },
  {
    id: '12',
    name: 'Bukit Broga',
    description:
      'A popular sunrise hike near Kuala Lumpur. Three peaks offer panoramic views of oil palm plantations and the surrounding countryside. Perfect for beginners and photography enthusiasts.',
    location: {
      city: 'Semenyih',
      state: 'Selangor',
      country: 'Malaysia',
      coordinates: { lat: 2.9389, lng: 101.9031 },
    },
    stats: {
      distance: 3,
      elevationGain: 300,
      estimatedTime: 90,
      difficulty: 'easy',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'Start early (5am) for sunrise views',
      'Trail can be slippery when wet',
      'Bring torchlight for early morning hikes',
      'RM3 entrance fee',
    ],
    path: [
      { lat: 2.9356, lng: 101.9012 },
      { lat: 2.9372, lng: 101.9022 },
      { lat: 2.9389, lng: 101.9031 },
    ],
    images: [
      getTrailImage(12, 'broga-sunrise'),
      getTrailImage(12, 'broga-hills'),
    ],
    rating: 4.5,
    reviewCount: 5432,
  },
  {
    id: '13',
    name: 'Taman Negara Canopy Walk',
    description:
      'One of the world\'s oldest rainforests (130 million years). The 530m canopy walkway is the longest in the world, suspended 40m above ground. Home to tigers, elephants, and rare wildlife.',
    location: {
      city: 'Kuala Tahan',
      state: 'Pahang',
      country: 'Malaysia',
      coordinates: { lat: 4.3833, lng: 102.4167 },
    },
    stats: {
      distance: 9,
      elevationGain: 150,
      estimatedTime: 240,
      difficulty: 'moderate',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: true,
    },
    safetyNotes: [
      'Canopy walkway opens 9am-3pm (Fri 9am-12pm)',
      'Book night jungle walks in advance',
      'Leech socks recommended during wet season',
      'Boat ride required to reach park',
    ],
    path: [
      { lat: 4.3812, lng: 102.4145 },
      { lat: 4.3833, lng: 102.4167 },
      { lat: 4.3856, lng: 102.4189 },
      { lat: 4.3812, lng: 102.4145 },
    ],
    images: [
      getTrailImage(13, 'taman-negara-canopy'),
      getTrailImage(13, 'taman-negara-jungle'),
    ],
    rating: 4.7,
    reviewCount: 3456,
  },
  {
    id: '14',
    name: 'Gunung Ledang (Mount Ophir)',
    description:
      'A mystical mountain steeped in legend, standing at 1,276m. Popular with hikers seeking a challenging overnight trek. Known for its beautiful waterfalls and diverse flora.',
    location: {
      city: 'Tangkak',
      state: 'Johor',
      country: 'Malaysia',
      coordinates: { lat: 2.3589, lng: 102.6203 },
    },
    stats: {
      distance: 12,
      elevationGain: 1000,
      estimatedTime: 600,
      difficulty: 'hard',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: true,
    },
    safetyNotes: [
      'Register at park office before hiking',
      'Camping permit required for overnight stays',
      'Rope sections near summit - bring gloves',
      'Best during dry season (March-October)',
    ],
    path: [
      { lat: 2.3512, lng: 102.6156 },
      { lat: 2.3551, lng: 102.6178 },
      { lat: 2.3589, lng: 102.6203 },
    ],
    images: [
      getTrailImage(14, 'ledang-waterfall'),
      getTrailImage(14, 'ledang-summit'),
    ],
    rating: 4.6,
    reviewCount: 2187,
  },
  {
    id: '15',
    name: 'Penang Hill Trail',
    description:
      'A heritage trail to the top of Penang Hill (821m). Multiple routes available from easy to challenging. Offers cool weather and panoramic views of George Town and the mainland.',
    location: {
      city: 'George Town',
      state: 'Penang',
      country: 'Malaysia',
      coordinates: { lat: 5.4234, lng: 100.2678 },
    },
    stats: {
      distance: 5.5,
      elevationGain: 700,
      estimatedTime: 180,
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
      'Can take funicular railway up or down',
      'Multiple trail routes - Jeep Track easiest',
      'Bring warm clothing - cooler at summit',
      'Monkeys present - secure food',
    ],
    path: [
      { lat: 5.4156, lng: 100.2623 },
      { lat: 5.4195, lng: 100.2651 },
      { lat: 5.4234, lng: 100.2678 },
    ],
    images: [
      getTrailImage(15, 'penang-hill-view'),
      getTrailImage(15, 'penang-hill-trail'),
    ],
    rating: 4.4,
    reviewCount: 4321,
  },
  {
    id: '16',
    name: 'Cameron Highlands Mossy Forest',
    description:
      'A mystical cloud forest at 2,000m elevation. The boardwalk trail winds through moss-covered trees and unique montane vegetation. One of Malaysia\'s most unique ecosystems.',
    location: {
      city: 'Brinchang',
      state: 'Pahang',
      country: 'Malaysia',
      coordinates: { lat: 4.5189, lng: 101.3867 },
    },
    stats: {
      distance: 2,
      elevationGain: 100,
      estimatedTime: 60,
      difficulty: 'easy',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: false,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'Guide recommended - easy to get lost',
      'Wear layers - cool and damp',
      'Trail can be muddy - wear proper shoes',
      'Best visited early morning for mist',
    ],
    path: [
      { lat: 4.5178, lng: 101.3856 },
      { lat: 4.5189, lng: 101.3867 },
      { lat: 4.5195, lng: 101.3878 },
      { lat: 4.5178, lng: 101.3856 },
    ],
    images: [
      getTrailImage(16, 'mossy-forest'),
      getTrailImage(16, 'cameron-highlands'),
    ],
    rating: 4.5,
    reviewCount: 2876,
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
