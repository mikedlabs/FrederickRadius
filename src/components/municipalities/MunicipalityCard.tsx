import type { Municipality } from '../../types';

interface Props {
  municipality: Municipality;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function MunicipalityCard({ municipality: m, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(m.id)}
      className={`group relative w-full overflow-hidden rounded-[26px] border p-4 text-left transition-all ${
        isSelected
          ? 'border-accent/45 bg-[linear-gradient(180deg,rgba(12,101,126,0.14),rgba(255,252,247,0.9))] shadow-[0_24px_50px_rgba(12,101,126,0.12)]'
          : 'border-border/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.88),rgba(246,239,226,0.92))] hover:-translate-y-0.5 hover:border-accent/25 hover:bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(244,235,221,0.94))]'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top_left,rgba(12,101,126,0.16),transparent_62%)] opacity-80" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
            Municipality profile
          </div>
          <h4 className="mt-2 truncate text-lg font-semibold text-text">{m.name}</h4>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Population snapshot {m.population.toLocaleString()} and approximately {m.area} square miles.
          </p>
        </div>

        <div className="rounded-full border border-border/70 bg-white/70 px-2.5 py-1 text-[10px] font-medium text-text-muted">
          Manual ref
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
        <span className="rounded-full border border-border/70 bg-white/65 px-2.5 py-1">
          Civic snapshot
        </span>
        <span className="rounded-full border border-border/70 bg-white/65 px-2.5 py-1">
          Select to inspect
        </span>
        {isSelected && (
          <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-semibold text-accent">
            Active
          </span>
        )}
      </div>
    </button>
  );
}
