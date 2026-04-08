import { useWeather } from '../../hooks/useWeather';
import { getWeatherEmoji } from '../../services/api/weather';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function WeatherPanel() {
  const { forecast, alerts, loading, error } = useWeather();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-3 text-sm text-danger">{error}</div>;

  const current = forecast[0];

  return (
    <div className="space-y-3">
      {alerts.length > 0 && (
        <div className="space-y-1.5">
          {alerts.map((a) => (
            <div key={a.id} className="rounded-lg border border-warning/30 bg-warning/10 p-2.5">
              <div className="flex items-center gap-2 text-sm font-medium text-warning">
                <span>⚠️</span>
                {a.event}
              </div>
              <p className="mt-1 text-xs text-text-secondary">{a.headline}</p>
            </div>
          ))}
        </div>
      )}

      {current && (
        <div className="rounded-lg bg-bg-elevated p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-text">
                {current.temperature}°{current.temperatureUnit}
              </div>
              <div className="mt-1 text-sm text-text-secondary">{current.shortForecast}</div>
              <div className="mt-0.5 text-xs text-text-muted">
                Wind: {current.windSpeed} {current.windDirection}
              </div>
            </div>
            <div className="text-4xl">{getWeatherEmoji(current.shortForecast)}</div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">7-Day Forecast</h4>
        <div className="space-y-1">
          {forecast.slice(1, 8).map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded bg-bg-surface px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getWeatherEmoji(f.shortForecast)}</span>
                <span className="text-sm text-text">{f.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{f.temperature}°</span>
                <span className="text-xs text-text-muted">{f.shortForecast}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-text-muted text-center">
        Source: National Weather Service (weather.gov)
      </div>
    </div>
  );
}
