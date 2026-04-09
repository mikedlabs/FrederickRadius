import type { AppState } from '../../types';
import { mapLayers } from '../../data/layers';
import { municipalities } from '../../data/municipalities';
import { sourceRegistry } from '../../data/source-registry';

interface MapSetupStateProps {
  onOpenPanel: (content: NonNullable<AppState['slidePanelContent']>) => void;
}

const QUICK_STATS = [
  { label: 'Municipalities', value: String(municipalities.length), note: 'Local profile snapshots', tone: 'from-sky-500/18 via-transparent to-transparent' },
  { label: 'Source Registry', value: String(Object.keys(sourceRegistry).length), note: 'Authority and cadence notes', tone: 'from-emerald-500/18 via-transparent to-transparent' },
  { label: 'Map Layers', value: String(mapLayers.length), note: 'Documented reference and live layers', tone: 'from-amber-400/18 via-transparent to-transparent' },
];

const READY_NOW = [
  'County dashboard and municipality profiles with trust notes',
  'Curated civic workflows that bundle layers around real local use cases',
  'Weather, water, traffic, 311, civic, and parking panels',
  'Search, command palette, and a documented source inventory',
];

const TOKEN_BENEFITS = [
  'Interactive county map canvas',
  '3D terrain and building view',
  'Direct map-layer exploration',
];

export function MapSetupState({ onOpenPanel }: MapSetupStateProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(12,101,126,0.22),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(177,129,41,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,247,0.82),rgba(244,235,221,0.88))]" />

      <div className="relative flex h-full flex-col gap-5 p-5 md:p-8">
        <div className="grid flex-1 gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <section className="panel-surface-strong topographic-lines flex min-h-[25rem] flex-col justify-between rounded-[38px] p-6 md:p-8">
            <div>
              <div className="eyebrow">Atlas workspace</div>
              <div className="mt-5 max-w-3xl">
                <h2 className="font-display text-4xl leading-[0.92] tracking-tight text-text md:text-6xl">
                  The civic atlas is already useful. The live map canvas still needs a token.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary">
                  Add <code className="rounded-full border border-border/70 bg-white/60 px-2 py-1 text-[0.92em] text-accent">VITE_MAPBOX_TOKEN</code> to
                  <code className="ml-2 rounded-full border border-border/70 bg-white/60 px-2 py-1 text-[0.92em] text-accent">.env.local</code> to unlock the full interactive Frederick County map. Until then, the product still functions as a serious local reference surface.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenPanel('dashboard')}
                  className="rounded-full bg-text px-5 py-3 text-sm font-semibold text-bg-elevated transition-transform hover:-translate-y-0.5"
                >
                  Open County Dashboard
                </button>
                <button
                  onClick={() => onOpenPanel('weather')}
                  className="rounded-full border border-border/80 bg-white/60 px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-white/88"
                >
                  Check Live Weather
                </button>
                <button
                  onClick={() => onOpenPanel('civic')}
                  className="rounded-full border border-border/80 bg-white/60 px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-white/88"
                >
                  Browse Civic Snapshot
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[30px] border border-border/70 bg-white/58 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  Available without a token
                </div>
                <div className="mt-4 space-y-3">
                  {READY_NOW.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 text-text-secondary">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/12 text-success">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,rgba(12,101,126,0.12),rgba(255,252,247,0.76))] p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  Token unlocks
                </div>
                <div className="mt-4 space-y-3">
                  {TOKEN_BENEFITS.map((item) => (
                    <div key={item} className="rounded-[20px] border border-border/60 bg-white/62 px-3 py-3 text-sm text-text-secondary">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="panel-surface rounded-[32px] p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Source posture
              </div>
              <h3 className="font-display mt-3 text-3xl leading-none text-text">
                Trust rules stay visible even when the map is offline.
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                This product should distinguish operational feeds, official reference data, community reports, manual civic snapshots, and derived logic at every step.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {QUICK_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.88),rgba(246,239,226,0.92))] p-5"
                >
                  <div className={`mb-5 h-16 rounded-[20px] bg-gradient-to-br ${stat.tone}`} />
                  <div className="text-3xl font-semibold tracking-tight text-text">{stat.value}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-text-muted">{stat.note}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
