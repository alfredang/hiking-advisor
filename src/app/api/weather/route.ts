import { NextRequest, NextResponse } from 'next/server';
import { calculateSuitability } from '@/lib/utils';
import type { Weather } from '@/types';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    // If API key is available, fetch real weather data
    if (OPENWEATHER_API_KEY) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const weather: Weather = {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        rainProbability: data.clouds?.all || 0,
        condition: data.weather[0]?.description || 'Unknown',
        icon: data.weather[0]?.icon || '01d',
        alerts: [],
      };

      const suitability = calculateSuitability(weather);

      return NextResponse.json({ weather, suitability });
    }

    // Return mock weather data if no API key
    const mockWeather: Weather = generateMockWeather();
    const suitability = calculateSuitability(mockWeather);

    return NextResponse.json({ weather: mockWeather, suitability });
  } catch (error) {
    console.error('Error fetching weather:', error);

    // Return mock data on error
    const mockWeather: Weather = generateMockWeather();
    const suitability = calculateSuitability(mockWeather);

    return NextResponse.json({ weather: mockWeather, suitability });
  }
}

function generateMockWeather(): Weather {
  const conditions = [
    { condition: 'clear sky', icon: '01d' },
    { condition: 'few clouds', icon: '02d' },
    { condition: 'scattered clouds', icon: '03d' },
    { condition: 'overcast clouds', icon: '04d' },
    { condition: 'light rain', icon: '10d' },
  ];

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const temperature = Math.round(15 + Math.random() * 15); // 15-30°C

  return {
    temperature,
    feelsLike: temperature + Math.round((Math.random() - 0.5) * 4),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 20),
    rainProbability: Math.round(Math.random() * 50),
    condition: randomCondition.condition,
    icon: randomCondition.icon,
    alerts: [],
  };
}
