import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Weather, HikingSuitability } from '@/types';
import { WEATHER_THRESHOLDS } from './constants';

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format distance with unit
export function formatDistance(km: number, useImperial = false): string {
  if (useImperial) {
    const miles = km * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
}

// Format elevation with unit
export function formatElevation(meters: number, useImperial = false): string {
  if (useImperial) {
    const feet = meters * 3.28084;
    return `${Math.round(feet).toLocaleString()} ft`;
  }
  return `${Math.round(meters).toLocaleString()} m`;
}

// Format time duration
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

// Format temperature
export function formatTemperature(celsius: number, useFahrenheit = false): string {
  if (useFahrenheit) {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

// Format wind speed
export function formatWindSpeed(kmh: number, useImperial = false): string {
  if (useImperial) {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

// Calculate hiking suitability based on weather
export function calculateSuitability(weather: Weather): HikingSuitability {
  const reasons: string[] = [];
  let status: 'good' | 'caution' | 'unsafe' = 'good';

  // Check temperature
  if (
    weather.temperature < WEATHER_THRESHOLDS.temperature.unsafe_low ||
    weather.temperature > WEATHER_THRESHOLDS.temperature.unsafe_high
  ) {
    status = 'unsafe';
    reasons.push(
      weather.temperature < WEATHER_THRESHOLDS.temperature.unsafe_low
        ? 'Dangerously cold temperatures'
        : 'Dangerously hot temperatures'
    );
  } else if (
    weather.temperature < WEATHER_THRESHOLDS.temperature.caution_low ||
    weather.temperature > WEATHER_THRESHOLDS.temperature.caution_high
  ) {
    if (status !== 'unsafe') status = 'caution';
    reasons.push(
      weather.temperature < WEATHER_THRESHOLDS.temperature.caution_low
        ? 'Cold temperatures - dress warmly'
        : 'Hot temperatures - stay hydrated'
    );
  }

  // Check wind
  if (weather.windSpeed > WEATHER_THRESHOLDS.wind.unsafe) {
    status = 'unsafe';
    reasons.push('Dangerous wind conditions');
  } else if (weather.windSpeed > WEATHER_THRESHOLDS.wind.caution) {
    if (status !== 'unsafe') status = 'caution';
    reasons.push('Strong winds expected');
  }

  // Check rain probability
  if (weather.rainProbability > WEATHER_THRESHOLDS.rain.unsafe) {
    status = 'unsafe';
    reasons.push('High chance of heavy rain');
  } else if (weather.rainProbability > WEATHER_THRESHOLDS.rain.caution) {
    if (status !== 'unsafe') status = 'caution';
    reasons.push('Chance of rain - bring rain gear');
  }

  // Check for weather alerts
  if (weather.alerts.length > 0) {
    const severeAlerts = weather.alerts.filter(
      (a) => a.severity === 'severe' || a.severity === 'extreme'
    );
    if (severeAlerts.length > 0) {
      status = 'unsafe';
      reasons.push(...severeAlerts.map((a) => a.message));
    } else {
      if (status !== 'unsafe') status = 'caution';
      reasons.push(...weather.alerts.map((a) => a.message));
    }
  }

  // If no issues found, add positive message
  if (reasons.length === 0) {
    reasons.push('Weather conditions are favorable for hiking');
  }

  return { status, reasons };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Get weather icon URL from OpenWeather
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Format rating
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Pluralize word
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || singular + 's';
}
