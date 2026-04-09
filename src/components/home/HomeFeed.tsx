/**
 * HomeFeed — the main scrollable content for the mobile half-sheet.
 * Shows actual data inline so users never have to tap through menus
 * to reach useful content.
 */
import { useWeather } from '../../hooks/useWeather';
import { useWaterLevels } from '../../hooks/useWaterLevels';
import { getWeatherEmoji } from '../../services/api/weather';
import { getLocalEvents } from '../../services/api/events';
import { upcomingMeetings } from '../../data/civic';
import { municipalities } from '../../data/municipalities';

interface Props {
  onOpenPanel: (content: string) => void;
  onSelectMunicipality: (id: string) => void;
  selectedMunicipality: string | null;
}

export function HomeFeed({ onOpenPanel, onSelectMunicipality, selectedMunicipality }: Props) {
  const { forecast, alerts } = useWeather();
  const { gauges } = useWaterLevels();
  const current = forecast[0];
  const events = getLocalEvents().slice(0, 3);
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const nextMeeting = upcomingMeetings
    .filter((m) => m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const highGauge = gauges
    .map((g) => {
      const h = g.values.find((v) => v.parameterCode === '00065');
      return { name: g.siteName.split(' at ')[0], height: h?.value || 0 };
    })
    .sort((a, b) => b.height - a.height)[0];

  return (
    <div className="space-y-5">

      {/* ── Weather + Alerts (inline, no tap needed) ── */}
      <button
        onClick={() => onOpenPanel('weather')}
        className="w-full text-left active:opacity-80"
      >
        {current ? (
          <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4">
            <div className="text-4xl">{getWeatherEmoji(current.shortForecast)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text tabular-nums">
                  {current.temperature}°
                </span>
                <span className="text-[13px] text-text-muted">{current.shortForecast}</span>
              </div>
              <div className="mt-0.5 text-[12px] text-text-muted">
                Wind {current.windSpeed} {current.windDirection}
              </div>
            </div>
            <svg className="h-4 w-4 flex-shrink-0 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ) : (
          <div className="h-20 animate-pulse rounded-2xl bg-white/40" />
        )}
      </button>

      {/* Active alerts — shown directly, no tap needed to see them */}
      {alerts.length > 0 && (
        <button
          onClick={() => onOpenPanel('weather')}
          className="w-full rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-left active:opacity-80"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span className="text-[13px] font-semibold text-amber-800">{alerts[0].event}</span>
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-amber-700 line-clamp-2">
            {alerts[0].headline}
          </div>
        </button>
      )}

      {/* ── Quick Info Row ── */}
      <div className="flex gap-2">
        {highGauge && (
          <button
            onClick={() => onOpenPanel('water')}
            className="flex-1 rounded-xl bg-white/50 px-3 py-2.5 text-left active:bg-white/70"
          >
            <div className="text-[11px] text-text-muted">Water</div>
            <div className="text-[15px] font-bold text-text tabular-nums">{highGauge.height.toFixed(1)} ft</div>
            <div className="text-[10px] text-text-muted truncate">{highGauge.name}</div>
          </button>
        )}
        <button
          onClick={() => onOpenPanel('traffic')}
          className="flex-1 rounded-xl bg-white/50 px-3 py-2.5 text-left active:bg-white/70"
        >
          <div className="text-[11px] text-text-muted">Traffic</div>
          <div className="text-[15px] font-bold text-text">CHART Live</div>
          <div className="text-[10px] text-text-muted">MD state highway</div>
        </button>
        {nextMeeting && (
          <button
            onClick={() => onOpenPanel('civic')}
            className="flex-1 rounded-xl bg-white/50 px-3 py-2.5 text-left active:bg-white/70"
          >
            <div className="text-[11px] text-text-muted">Civic</div>
            <div className="text-[15px] font-bold text-text truncate">
              {formatMeetingDate(nextMeeting.date, now)}
            </div>
            <div className="text-[10px] text-text-muted truncate">
              {nextMeeting.title.replace('County Council ', '')}
            </div>
          </button>
        )}
      </div>

      {/* ── Explore Frederick ── */}
      <div>
        <SectionHeader title="Explore" action="See all" onAction={() => onOpenPanel('places')} />
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '🍽️', label: 'Restaurants', cat: 'dining' },
            { icon: '☕', label: 'Coffee', cat: 'coffee' },
            { icon: '🍸', label: 'Bars', cat: 'bars' },
            { icon: '🛍️', label: 'Shopping', cat: 'shopping' },
          ].map((item) => (
            <button
              key={item.cat}
              onClick={() => onOpenPanel('places')}
              className="flex items-center gap-2.5 rounded-xl bg-white/50 px-3 py-2.5 text-left active:bg-white/70"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[13px] font-medium text-text">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Events — show actual events inline ── */}
      <div>
        <SectionHeader title="Events & Things to Do" action="See all" onAction={() => onOpenPanel('events')} />
        <div className="space-y-1.5">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onOpenPanel('events')}
              className="flex w-full items-center gap-3 rounded-xl bg-white/50 px-3 py-2.5 text-left active:bg-white/70"
            >
              <span className="text-lg">{eventIcon(event.category)}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-text truncate">{event.title}</div>
                <div className="text-[11px] text-text-muted truncate">{event.date} · {event.venue}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Municipalities — horizontal scroll ── */}
      <div>
        <SectionHeader
          title="Municipalities"
          action="Compare"
          onAction={() => onOpenPanel('compare')}
        />
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            {municipalities.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMunicipality(m.id)}
                className={`flex-shrink-0 w-32 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  selectedMunicipality === m.id
                    ? 'bg-accent/10 border border-accent/30'
                    : 'bg-white/50 active:bg-white/70'
                }`}
              >
                <div className="text-[13px] font-medium text-text truncate">{m.name}</div>
                <div className="text-[11px] text-text-muted tabular-nums">
                  {m.population.toLocaleString()} pop
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── More ── */}
      <div className="flex gap-2 pb-6">
        {[
          { icon: '📢', label: '311 Reports', panel: 'reports' },
          { icon: '🅿️', label: 'Parking', panel: 'parking' },
          { icon: '📊', label: 'Dashboard', panel: 'dashboard' },
        ].map((item) => (
          <button
            key={item.panel}
            onClick={() => onOpenPanel(item.panel)}
            className="flex-1 rounded-xl bg-white/40 py-2.5 text-center active:bg-white/60 transition-colors"
          >
            <div className="text-base">{item.icon}</div>
            <div className="mt-0.5 text-[11px] font-medium text-text-muted">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-[14px] font-semibold text-text">{title}</h3>
      <button onClick={onAction} className="text-[13px] font-medium text-accent active:opacity-60">
        {action}
      </button>
    </div>
  );
}

function formatMeetingDate(dateStr: string, now: Date): string {
  const date = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function eventIcon(category: string): string {
  const icons: Record<string, string> = {
    music: '🎵', food: '🍽️', arts: '🎨', community: '🤝',
    sports: '⚽', markets: '🧺', nightlife: '🍺', family: '👨‍👩‍👧‍👦',
  };
  return icons[category] ?? '📌';
}
