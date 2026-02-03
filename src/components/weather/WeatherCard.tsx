'use client';

import { Cloud, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTemperature, formatWindSpeed, getWeatherIconUrl } from '@/lib/utils';
import { Card, LoadingSkeleton } from '@/components/ui';
import { HikingSuitability } from './HikingSuitability';
import { useStore } from '@/store/useStore';
import type { Weather, HikingSuitability as HikingSuitabilityType } from '@/types';

interface WeatherCardProps {
  weather: Weather | null;
  suitability: HikingSuitabilityType | null;
  isLoading?: boolean;
}

export function WeatherCard({ weather, suitability, isLoading }: WeatherCardProps) {
  const { useImperialUnits } = useStore();

  if (isLoading) {
    return (
      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-4">
          <LoadingSkeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-6 w-24" />
            <LoadingSkeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <LoadingSkeleton className="h-12" />
          <LoadingSkeleton className="h-12" />
          <LoadingSkeleton className="h-12" />
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card variant="bordered" className="text-center py-6">
        <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Weather data unavailable</p>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className="space-y-4">
      {/* Main weather display */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          {weather.icon && (
            <img
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.condition}
              className="h-full w-full"
            />
          )}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {formatTemperature(weather.temperature, useImperialUnits)}
          </div>
          <div className="text-sm text-gray-500 capitalize">{weather.condition}</div>
          <div className="text-xs text-gray-400">
            Feels like {formatTemperature(weather.feelsLike, useImperialUnits)}
          </div>
        </div>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Wind className="h-4 w-4 text-gray-500 mb-1" />
          <span className="text-sm font-medium">{formatWindSpeed(weather.windSpeed, useImperialUnits)}</span>
          <span className="text-xs text-gray-500">Wind</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Droplets className="h-4 w-4 text-blue-500 mb-1" />
          <span className="text-sm font-medium">{weather.rainProbability}%</span>
          <span className="text-xs text-gray-500">Rain</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Thermometer className="h-4 w-4 text-gray-500 mb-1" />
          <span className="text-sm font-medium">{weather.humidity}%</span>
          <span className="text-xs text-gray-500">Humidity</span>
        </div>
      </div>

      {/* Hiking suitability */}
      {suitability && <HikingSuitability suitability={suitability} />}

      {/* Weather alerts */}
      {weather.alerts.length > 0 && (
        <div className="space-y-2">
          {weather.alerts.map((alert, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 p-3 rounded-lg text-sm',
                alert.severity === 'extreme' || alert.severity === 'severe'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-yellow-50 text-yellow-700'
              )}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium capitalize">{alert.type}: </span>
                {alert.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
