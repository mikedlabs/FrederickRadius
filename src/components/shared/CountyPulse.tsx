import { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWeatherEmoji } from '../../services/api/weather';
import { useAppState } from '../../hooks/useAppState';

export function CountyPulse() {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState(new Date());
  const { forecast, alerts } = useWeather();
  const { gauges } = useWaterLevels();
  const { dispatch } = useAppState();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const current = forecast[0];
  const greeting = getGreeting(time);

  return (
    <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="glass flex items-center gap-3 rounded-full px-4 py-2 text-left transition-all hover:-translate-y-0.5"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
        </span>

        <span className="text-xs font-medium text-text-secondary">{greeting}</span>

        {current && (
          <span className="rounded-full border border-border/60 bg-white/55 px-2.5 py-1 text-xs font-semibold text-text">
            {getWeatherEmoji(current.shortForecast)} {current.temperature}°{current.temperatureUnit}
          </span>
        )}

        {alerts.length > 0 && (
          <span className="rounded-full border border-warning/20 bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            {alerts.length} alert{alerts.length > 1 ? 's' : ''}
          </span>
        )}

        <svg
          className={`h-3 w-3 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="panel-surface-strong topographic-lines mt-3 w-[22rem] rounded-[28px] p-4 animate-slide-in">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Frederick feed snapshot
              </div>
              <div className="mt-1 text-xs text-text-muted">
                Selected feeds and context layers, not a full county operations center.
              </div>
            </div>
            <div className="rounded-full border border-border/60 bg-white/55 px-2.5 py-1 text-[10px] text-text-secondary">
              {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <PulseCard
              icon="🌤️"
              label="Weather"
              value={current ? `${current.temperature}°${current.temperatureUnit}` : '...'}
              detail={current?.shortForecast || 'Loading forecast'}
              onClick={() => {
                dispatch({ type: 'OPEN_PANEL', content: 'weather' });
                setExpanded(false);
              }}
            />
            <PulseCard
              icon="💧"
              label="USGS Gauges"
              value={gauges.length > 0 ? String(gauges.length) : '...'}
              detail="Recent readings by site"
              onClick={() => {
                dispatch({ type: 'OPEN_PANEL', content: 'water' });
                setExpanded(false);
              }}
            />
            <PulseCard
              icon="🚗"
              label="Traffic"
              value="CHART"
              detail="State feed filtered to Frederick area"
              onClick={() => {
                dispatch({ type: 'OPEN_PANEL', content: 'traffic' });
                setExpanded(false);
              }}
            />
            <PulseCard
              icon="📢"
              label="311 Reports"
              value="Community"
              detail="SeeClickFix issues, mostly city"
              onClick={() => {
                dispatch({ type: 'OPEN_PANEL', content: 'reports' });
                setExpanded(false);
              }}
            />
          </div>

          {alerts.length > 0 && (
            <div className="mt-3 space-y-2">
              {alerts.slice(0, 2).map((a, i) => (
                <div key={i} className="rounded-[20px] border border-warning/20 bg-warning/10 px-3 py-3">
                  <div className="text-xs font-semibold text-warning">{a.event}</div>
                  <div className="mt-1 text-[11px] leading-5 text-text-secondary line-clamp-2">{a.headline}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PulseCard({
  icon,
  label,
  value,
  detail,
  onClick,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] border border-border/70 bg-white/62 p-3 text-left transition-colors hover:bg-white/88"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {label}
        </span>
      </div>
      <div className="mt-2 text-base font-semibold text-text">{value}</div>
      <div className="mt-1 text-[11px] leading-5 text-text-muted">{detail}</div>
    </button>
  );
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  if (hour < 12) return `Good morning · ${day}`;
  if (hour < 17) return `Good afternoon · ${day}`;
  return `Good evening · ${day}`;
}
