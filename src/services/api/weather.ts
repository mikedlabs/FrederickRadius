import type { WeatherForecast, WeatherAlert } from '../../types';

const FORECAST_URL = 'https://api.weather.gov/gridpoints/LWX/80,93/forecast';
const HOURLY_URL = 'https://api.weather.gov/gridpoints/LWX/80,93/forecast/hourly';
const ALERTS_URL = 'https://api.weather.gov/alerts/active?zone=MDZ004';

const HEADERS = {
  'User-Agent': 'FrederickRadius/1.0 (civic-engagement-app)',
  Accept: 'application/geo+json',
};

let forecastCache: { data: WeatherForecast[]; timestamp: number } | null = null;
let alertsCache: { data: WeatherAlert[]; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchForecast(): Promise<WeatherForecast[]> {
  if (forecastCache && Date.now() - forecastCache.timestamp < CACHE_TTL) {
    return forecastCache.data;
  }

  const res = await fetch(FORECAST_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const json = await res.json();

  const forecasts: WeatherForecast[] = json.properties.periods.map(
    (p: Record<string, unknown>) => ({
      name: p.name as string,
      temperature: p.temperature as number,
      temperatureUnit: p.temperatureUnit as string,
      windSpeed: p.windSpeed as string,
      windDirection: p.windDirection as string,
      shortForecast: p.shortForecast as string,
      detailedForecast: p.detailedForecast as string,
      icon: p.icon as string,
      isDaytime: p.isDaytime as boolean,
    })
  );

  forecastCache = { data: forecasts, timestamp: Date.now() };
  return forecasts;
}

export async function fetchHourlyForecast(): Promise<WeatherForecast[]> {
  const res = await fetch(HOURLY_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const json = await res.json();

  return json.properties.periods.slice(0, 24).map(
    (p: Record<string, unknown>) => ({
      name: p.name as string,
      temperature: p.temperature as number,
      temperatureUnit: p.temperatureUnit as string,
      windSpeed: p.windSpeed as string,
      windDirection: p.windDirection as string,
      shortForecast: p.shortForecast as string,
      detailedForecast: p.detailedForecast as string,
      icon: p.icon as string,
      isDaytime: p.isDaytime as boolean,
    })
  );
}

export async function fetchAlerts(): Promise<WeatherAlert[]> {
  if (alertsCache && Date.now() - alertsCache.timestamp < CACHE_TTL) {
    return alertsCache.data;
  }

  const res = await fetch(ALERTS_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`Alerts API error: ${res.status}`);
  const json = await res.json();

  const alerts: WeatherAlert[] = (json.features || []).map(
    (f: Record<string, Record<string, unknown>>) => ({
      id: f.properties.id as string,
      event: f.properties.event as string,
      headline: f.properties.headline as string,
      severity: f.properties.severity as string,
      description: f.properties.description as string,
      expires: f.properties.expires as string,
    })
  );

  alertsCache = { data: alerts, timestamp: Date.now() };
  return alerts;
}

export function getWeatherEmoji(shortForecast: string): string {
  const f = shortForecast.toLowerCase();
  if (f.includes('sunny') || f.includes('clear')) return '☀️';
  if (f.includes('partly cloudy') || f.includes('partly sunny')) return '⛅';
  if (f.includes('cloudy') || f.includes('overcast')) return '☁️';
  if (f.includes('rain') || f.includes('shower')) return '🌧️';
  if (f.includes('thunder') || f.includes('storm')) return '⛈️';
  if (f.includes('snow')) return '🌨️';
  if (f.includes('fog')) return '🌫️';
  if (f.includes('wind')) return '💨';
  return '🌤️';
}
