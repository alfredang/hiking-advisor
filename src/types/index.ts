// Coordinate type
export interface Coordinates {
  lat: number;
  lng: number;
}

// Trail difficulty levels
export type Difficulty = 'easy' | 'moderate' | 'hard';

// Trail types
export type TrailType = 'loop' | 'out-and-back' | 'point-to-point';

// Trail location
export interface TrailLocation {
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
}

// Trail statistics
export interface TrailStats {
  distance: number; // km
  elevationGain: number; // meters
  estimatedTime: number; // minutes
  difficulty: Difficulty;
  trailType: TrailType;
}

// Trail facilities
export interface TrailFacilities {
  parking: boolean;
  toilets: boolean;
  waterPoints: boolean;
  campsites: boolean;
}

// Main Trail interface
export interface Trail {
  id: string;
  // Google Places identifier for fetching authoritative photos and details
  placeId?: string;
  name: string;
  description: string;
  location: TrailLocation;
  stats: TrailStats;
  facilities: TrailFacilities;
  safetyNotes: string[];
  path: Coordinates[];
  images: string[];
  rating: number;
  reviewCount: number;
}

// Weather alert
export interface WeatherAlert {
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  message: string;
}

// Weather data
export interface Weather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  condition: string;
  icon: string;
  alerts: WeatherAlert[];
}

// Hiking suitability status
export type SuitabilityStatus = 'good' | 'caution' | 'unsafe';

// Hiking suitability
export interface HikingSuitability {
  status: SuitabilityStatus;
  reasons: string[];
}

// Search filters
export interface SearchFilters {
  query: string;
  difficulty: Difficulty[];
  distanceRange: [number, number];
  elevationRange: [number, number];
  trailType: TrailType[];
  facilities: (keyof TrailFacilities)[];
}

// Default search filters
export const defaultFilters: SearchFilters = {
  query: '',
  difficulty: [],
  distanceRange: [0, 50],
  elevationRange: [0, 2000],
  trailType: [],
  facilities: [],
};

// Chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Chat context for AI
export interface ChatContext {
  selectedTrail: Trail | null;
  weather: Weather | null;
  suitability: HikingSuitability | null;
}

// API Response types
export interface TrailsApiResponse {
  trails: Trail[];
  total: number;
}

export interface WeatherApiResponse {
  weather: Weather;
  suitability: HikingSuitability;
}

export interface ChatApiResponse {
  message: string;
}

export interface ImagesApiResponse {
  images: string[];
}
