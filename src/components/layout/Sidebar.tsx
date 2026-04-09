import { useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { municipalities } from '../../data/municipalities';
import { mapLayers } from '../../data/layers';
import { sourceRegistry } from '../../data/source-registry';
import { MunicipalityCard } from '../municipalities/MunicipalityCard';
import { MapControls } from '../map/MapControls';
import { SearchBar } from './SearchBar';

interface Props {
  onOpenPanel: (content: 'weather' | 'water' | 'civic' | 'rewards' | 'traffic' | 'reports' | 'parking' | 'compare' | 'dashboard') => void;
  onStartTour?: () => void;
}

export function Sidebar({ onOpenPanel, onStartTour }: Props) {
  const { state, dispatch } = useAppState();

  const quickActions = useMemo(
    () => [
      { icon: '🌤️', label: 'Weather', detail: 'Forecast and alerts', tone: 'from-sky-500/18 to-white/0', onClick: () => onOpenPanel('weather') },
      { icon: '💧', label: 'Water', detail: 'USGS gauge context', tone: 'from-cyan-500/18 to-white/0', onClick: () => onOpenPanel('water') },
      { icon: '🚗', label: 'Traffic', detail: 'Live CHART overlay', tone: 'from-amber-400/22 to-white/0', onClick: () => onOpenPanel('traffic') },
      { icon: '🏛️', label: 'Civic', detail: 'Meetings and reps', tone: 'from-violet-400/18 to-white/0', onClick: () => onOpenPanel('civic') },
      { icon: '📢', label: '311', detail: 'Community reports', tone: 'from-emerald-400/18 to-white/0', onClick: () => onOpenPanel('reports') },
      { icon: '🅿️', label: 'Parking', detail: 'Manual inventory', tone: 'from-indigo-400/18 to-white/0', onClick: () => onOpenPanel('parking') },
    ],
    [onOpenPanel]
  );

  return (
    <div className="flex h-full w-80 flex-shrink-0 bg-transparent p-3 lg:w-[390px] lg:p-4">
      <div className="panel-surface-strong topographic-lines relative flex h-full w-full flex-col overflow-hidden rounded-[34px]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(12,101,126,0.18),transparent_68%)]" />

        <div className="relative border-b border-border/70 px-4 py-5 lg:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="eyebrow">Frederick County Atlas</div>
              <h1 className="font-display mt-4 text-[2.1rem] leading-none tracking-tight text-text">
                Frederick Radius
              </h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-text-secondary">
                Trust-first civic intelligence for Frederick County and the City of Frederick.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                className="rounded-2xl border border-border/70 bg-white/60 p-2 text-text-muted transition-colors hover:bg-white/90 hover:text-text lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="rounded-full border border-border/70 bg-white/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Trust-first build
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <SidebarStat label="Municipalities" value={String(municipalities.length)} />
            <SidebarStat label="Sources" value={String(Object.keys(sourceRegistry).length)} />
            <SidebarStat label="Layers" value={String(mapLayers.length)} />
          </div>

          <div className="mt-5">
            <SearchBar />
          </div>
        </div>

        <div className="relative border-b border-border/70 px-4 py-4 lg:px-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Field Guide
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Start from live feeds and curated use cases before opening the full layer stack.
              </p>
            </div>
            {onStartTour && (
              <button
                onClick={onStartTour}
                className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/14"
              >
                Tour
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <QuickAction
                key={action.label}
                icon={action.icon}
                label={action.label}
                detail={action.detail}
                tone={action.tone}
                onClick={action.onClick}
              />
            ))}
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('layer-controls');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-2 flex w-full items-center justify-between rounded-[22px] border border-border/70 bg-white/60 px-4 py-3 text-left transition-colors hover:bg-white/85"
          >
            <div>
              <div className="text-sm font-semibold text-text">Map Layers</div>
              <div className="text-[11px] text-text-muted">Open controls and filter the catalog</div>
            </div>
            <span className="rounded-full border border-border/60 bg-bg-surface px-2 py-1 text-[10px] text-text-secondary">
              {mapLayers.length} total
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Municipality Reference
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Manual civic snapshots stay visibly separate from operational feeds.
              </p>
            </div>
            <button
              onClick={() => onOpenPanel('compare')}
              className="rounded-full border border-border/70 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-white/85 hover:text-text"
            >
              Compare
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {municipalities.map((m) => (
              <MunicipalityCard
                key={m.id}
                municipality={m}
                isSelected={state.selectedMunicipality === m.id}
                onSelect={(id) => dispatch({ type: 'SELECT_MUNICIPALITY', id })}
              />
            ))}
          </div>

          <div id="layer-controls" className="panel-inset mt-6 rounded-[28px] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  Layer Controls
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Use reference layers with explicit trust notes and source family boundaries.
                </p>
              </div>
            </div>
            <MapControls />
          </div>
        </div>

        <div className="border-t border-border/70 px-4 py-4 lg:px-5">
          <div className="rounded-[24px] border border-border/70 bg-white/55 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
              Product posture
            </div>
            <div className="mt-2 text-xs leading-5 text-text-secondary">
              Official feeds, community reports, manual snapshots, and derived logic are intentionally presented as different source families.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  detail,
  tone,
  onClick,
}: {
  icon: string;
  label: string;
  detail: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.82),rgba(246,239,226,0.94))] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-accent/25`}
    >
      <div className={`mb-3 h-11 w-11 rounded-[18px] bg-gradient-to-br ${tone} flex items-center justify-center text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]`}>
        {icon}
      </div>
      <div className="text-sm font-semibold text-text">{label}</div>
      <div className="mt-1 text-[11px] leading-5 text-text-muted">{detail}</div>
    </button>
  );
}

function SidebarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-white/60 px-3 py-3">
      <div className="text-lg font-semibold text-text">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
        {label}
      </div>
    </div>
  );
}
