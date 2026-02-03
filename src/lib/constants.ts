// Map constants
export const DEFAULT_MAP_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA
export const DEFAULT_MAP_ZOOM = 4;
export const SELECTED_TRAIL_ZOOM = 12;

// Difficulty colors and labels
export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-100',
  },
  moderate: {
    label: 'Moderate',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-100',
  },
  hard: {
    label: 'Hard',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-100',
  },
} as const;

// Trail type labels
export const TRAIL_TYPE_LABELS = {
  loop: 'Loop',
  'out-and-back': 'Out & Back',
  'point-to-point': 'Point to Point',
} as const;

// Facility icons and labels
export const FACILITY_CONFIG = {
  parking: {
    label: 'Parking',
    icon: 'ParkingCircle',
  },
  toilets: {
    label: 'Restrooms',
    icon: 'Toilet',
  },
  waterPoints: {
    label: 'Water',
    icon: 'Droplets',
  },
  campsites: {
    label: 'Camping',
    icon: 'Tent',
  },
} as const;

// Weather suitability thresholds
export const WEATHER_THRESHOLDS = {
  temperature: {
    unsafe_low: -10, // Celsius
    caution_low: 0,
    caution_high: 35,
    unsafe_high: 40,
  },
  wind: {
    caution: 40, // km/h
    unsafe: 60,
  },
  rain: {
    caution: 30, // percentage
    unsafe: 60,
  },
} as const;

// Suitability status config
export const SUITABILITY_CONFIG = {
  good: {
    label: 'Good Conditions',
    icon: 'CheckCircle',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  caution: {
    label: 'Use Caution',
    icon: 'AlertTriangle',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  unsafe: {
    label: 'Not Recommended',
    icon: 'XCircle',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
} as const;

// Filter ranges
export const DISTANCE_RANGE = {
  min: 0,
  max: 50, // km
  step: 1,
} as const;

export const ELEVATION_RANGE = {
  min: 0,
  max: 2000, // meters
  step: 50,
} as const;

// API endpoints (relative)
export const API_ENDPOINTS = {
  trails: '/api/trails',
  weather: '/api/weather',
  images: '/api/images',
  chat: '/api/chat',
} as const;
