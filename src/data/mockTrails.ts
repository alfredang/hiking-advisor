import { Trail } from '@/types';

export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Half Dome Trail',
    description:
      'One of Yosemite\'s most iconic hikes, featuring stunning views of the valley and a challenging cable climb to the summit. This strenuous hike rewards adventurers with breathtaking panoramic views.',
    location: {
      city: 'Yosemite Valley',
      state: 'California',
      country: 'USA',
      coordinates: { lat: 37.7459, lng: -119.5332 },
    },
    stats: {
      distance: 22.5,
      elevationGain: 1463,
      estimatedTime: 600,
      difficulty: 'hard',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: true,
    },
    safetyNotes: [
      'Permit required for cables section (seasonal)',
      'Start before dawn to complete before afternoon thunderstorms',
      'Bring at least 4 liters of water per person',
      'Not recommended during wet conditions - cables become slippery',
    ],
    path: [
      { lat: 37.7349, lng: -119.5647 },
      { lat: 37.7385, lng: -119.5589 },
      { lat: 37.7421, lng: -119.5512 },
      { lat: 37.7445, lng: -119.5423 },
      { lat: 37.7459, lng: -119.5332 },
    ],
    images: [
      'https://images.unsplash.com/photo-1562310503-a918c4c61e38?w=800',
      'https://images.unsplash.com/photo-1544085311-11a028465b03?w=800',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    ],
    rating: 4.9,
    reviewCount: 2847,
  },
  {
    id: '2',
    name: 'Angel\'s Landing',
    description:
      'A thrilling hike in Zion National Park featuring steep switchbacks, chain-assisted sections, and spectacular views of Zion Canyon. One of America\'s most famous and exhilarating trails.',
    location: {
      city: 'Springdale',
      state: 'Utah',
      country: 'USA',
      coordinates: { lat: 37.2692, lng: -112.9465 },
    },
    stats: {
      distance: 8.7,
      elevationGain: 453,
      estimatedTime: 240,
      difficulty: 'hard',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: true,
      campsites: false,
    },
    safetyNotes: [
      'Permit required for chains section',
      'Avoid during lightning storms',
      'Not suitable for those afraid of heights',
      'Chains section very dangerous when wet or icy',
    ],
    path: [
      { lat: 37.2594, lng: -112.9507 },
      { lat: 37.2625, lng: -112.9489 },
      { lat: 37.2658, lng: -112.9472 },
      { lat: 37.2692, lng: -112.9465 },
    ],
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    ],
    rating: 4.8,
    reviewCount: 3156,
  },
  {
    id: '3',
    name: 'Emerald Lake Trail',
    description:
      'A beautiful moderate hike in Rocky Mountain National Park leading to three alpine lakes. Perfect for families and photographers seeking mountain scenery without extreme difficulty.',
    location: {
      city: 'Estes Park',
      state: 'Colorado',
      country: 'USA',
      coordinates: { lat: 40.3107, lng: -105.6648 },
    },
    stats: {
      distance: 5.8,
      elevationGain: 198,
      estimatedTime: 150,
      difficulty: 'moderate',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'Trail can be icy in early morning',
      'Afternoon thunderstorms common in summer',
      'Bear country - store food properly',
    ],
    path: [
      { lat: 40.3115, lng: -105.6432 },
      { lat: 40.3112, lng: -105.6512 },
      { lat: 40.3109, lng: -105.6589 },
      { lat: 40.3107, lng: -105.6648 },
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800',
    ],
    rating: 4.7,
    reviewCount: 1892,
  },
  {
    id: '4',
    name: 'Skyline Loop Trail',
    description:
      'A scenic loop through Mount Rainier\'s subalpine meadows with wildflowers in summer. Offers close-up views of glaciers and the mountain\'s majestic peak.',
    location: {
      city: 'Ashford',
      state: 'Washington',
      country: 'USA',
      coordinates: { lat: 46.7867, lng: -121.7353 },
    },
    stats: {
      distance: 9.3,
      elevationGain: 518,
      estimatedTime: 300,
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
      'Snow may persist into July',
      'Weather changes rapidly - bring layers',
      'Stay on trail to protect fragile meadows',
    ],
    path: [
      { lat: 46.7852, lng: -121.7365 },
      { lat: 46.7889, lng: -121.7312 },
      { lat: 46.7912, lng: -121.7289 },
      { lat: 46.7867, lng: -121.7353 },
    ],
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
    ],
    rating: 4.8,
    reviewCount: 1654,
  },
  {
    id: '5',
    name: 'Cascade Falls Trail',
    description:
      'A family-friendly easy hike to a beautiful waterfall in the Blue Ridge Mountains. Well-maintained trail suitable for hikers of all skill levels.',
    location: {
      city: 'Pembroke',
      state: 'Virginia',
      country: 'USA',
      coordinates: { lat: 37.3689, lng: -80.5912 },
    },
    stats: {
      distance: 6.4,
      elevationGain: 152,
      estimatedTime: 120,
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
      'Rocks near waterfall can be slippery',
      'Stay behind safety barriers',
      'Trail can flood after heavy rain',
    ],
    path: [
      { lat: 37.3645, lng: -80.5967 },
      { lat: 37.3665, lng: -80.5942 },
      { lat: 37.3689, lng: -80.5912 },
    ],
    images: [
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800',
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800',
    ],
    rating: 4.5,
    reviewCount: 967,
  },
  {
    id: '6',
    name: 'Appalachian Trail - McAfee Knob',
    description:
      'The most photographed spot on the entire Appalachian Trail. A moderate hike to an iconic rock outcropping with panoramic views of the Catawba Valley.',
    location: {
      city: 'Salem',
      state: 'Virginia',
      country: 'USA',
      coordinates: { lat: 37.3932, lng: -80.0355 },
    },
    stats: {
      distance: 13.5,
      elevationGain: 548,
      estimatedTime: 270,
      difficulty: 'moderate',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: true,
    },
    safetyNotes: [
      'Very crowded on weekends - arrive early',
      'No barriers at overlook - watch children',
      'Icy conditions dangerous in winter',
    ],
    path: [
      { lat: 37.3875, lng: -80.0478 },
      { lat: 37.3898, lng: -80.0423 },
      { lat: 37.3915, lng: -80.0389 },
      { lat: 37.3932, lng: -80.0355 },
    ],
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800',
      'https://images.unsplash.com/photo-1486915309615-4e82f04aa8d7?w=800',
    ],
    rating: 4.7,
    reviewCount: 2341,
  },
  {
    id: '7',
    name: 'Grand Canyon South Kaibab Trail',
    description:
      'A steep descent into the Grand Canyon with stunning views. The trail follows a ridge providing open panoramas of the canyon\'s layered geology.',
    location: {
      city: 'Grand Canyon Village',
      state: 'Arizona',
      country: 'USA',
      coordinates: { lat: 36.0527, lng: -112.0845 },
    },
    stats: {
      distance: 11.3,
      elevationGain: 1372,
      estimatedTime: 480,
      difficulty: 'hard',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: true,
    },
    safetyNotes: [
      'No water on trail - carry minimum 4 liters',
      'Do not attempt to hike to river and back in one day',
      'Summer temperatures at bottom can exceed 110°F',
      'Start before sunrise for day hikes',
    ],
    path: [
      { lat: 36.0544, lng: -112.0831 },
      { lat: 36.0538, lng: -112.0838 },
      { lat: 36.0533, lng: -112.0842 },
      { lat: 36.0527, lng: -112.0845 },
    ],
    images: [
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
      'https://images.unsplash.com/photo-1575527048208-6a518b677e5e?w=800',
    ],
    rating: 4.9,
    reviewCount: 4521,
  },
  {
    id: '8',
    name: 'Sunset Beach Nature Trail',
    description:
      'A peaceful easy coastal walk through dunes and along the beach. Perfect for birdwatching and enjoying ocean views without strenuous hiking.',
    location: {
      city: 'Sunset Beach',
      state: 'North Carolina',
      country: 'USA',
      coordinates: { lat: 33.8821, lng: -78.5125 },
    },
    stats: {
      distance: 3.2,
      elevationGain: 15,
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
      'Use sunscreen - limited shade',
      'Check tide schedules before going',
      'Respect nesting bird areas',
    ],
    path: [
      { lat: 33.8801, lng: -78.5145 },
      { lat: 33.8815, lng: -78.5128 },
      { lat: 33.8821, lng: -78.5125 },
      { lat: 33.8801, lng: -78.5145 },
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
    ],
    rating: 4.3,
    reviewCount: 543,
  },
  {
    id: '9',
    name: 'Zion Narrows',
    description:
      'A unique canyon hiking experience wading through the Virgin River. Surrounded by towering sandstone walls reaching up to 2,000 feet.',
    location: {
      city: 'Springdale',
      state: 'Utah',
      country: 'USA',
      coordinates: { lat: 37.2856, lng: -112.9478 },
    },
    stats: {
      distance: 16.1,
      elevationGain: 102,
      estimatedTime: 420,
      difficulty: 'moderate',
      trailType: 'out-and-back',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: false,
    },
    safetyNotes: [
      'Check flash flood warnings before hiking',
      'Water shoes or canyoneering boots required',
      'River depth varies - trekking poles recommended',
      'Cold water - hypothermia risk in cooler months',
    ],
    path: [
      { lat: 37.2892, lng: -112.9489 },
      { lat: 37.2875, lng: -112.9483 },
      { lat: 37.2856, lng: -112.9478 },
    ],
    images: [
      'https://images.unsplash.com/photo-1527333656061-99ec4e2d3e46?w=800',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1520962922320-2038eebab146?w=800',
    ],
    rating: 4.9,
    reviewCount: 3678,
  },
  {
    id: '10',
    name: 'Old Rag Mountain',
    description:
      'A challenging rock scramble in Shenandoah National Park. Features a famous granite rock scramble section that tests both fitness and climbing skills.',
    location: {
      city: 'Syria',
      state: 'Virginia',
      country: 'USA',
      coordinates: { lat: 38.5529, lng: -78.3166 },
    },
    stats: {
      distance: 14.5,
      elevationGain: 823,
      estimatedTime: 360,
      difficulty: 'hard',
      trailType: 'loop',
    },
    facilities: {
      parking: true,
      toilets: true,
      waterPoints: false,
      campsites: true,
    },
    safetyNotes: [
      'Reservation required on weekends',
      'Rock scramble not suitable for dogs',
      'Avoid during rain - rocks extremely slippery',
      'Several exposed sections with steep drops',
    ],
    path: [
      { lat: 38.5612, lng: -78.3232 },
      { lat: 38.5578, lng: -78.3198 },
      { lat: 38.5545, lng: -78.3178 },
      { lat: 38.5529, lng: -78.3166 },
      { lat: 38.5612, lng: -78.3232 },
    ],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=800',
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800',
    ],
    rating: 4.6,
    reviewCount: 2156,
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
