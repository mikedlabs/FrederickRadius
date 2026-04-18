import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { lenses, detectActiveLens, type Lens } from '../../data/lenses';
import { staggerContainer, staggerItem } from '../../lib/motion';

export function LensGrid() {
  const { state, dispatch } = useAppState();
  const activeLens = detectActiveLens(state.activeLayers);

  function applyLens(lens: Lens) {
    if (activeLens?.id === lens.id) {
      dispatch({ type: 'CLEAR_LAYERS' });
    } else {
      dispatch({ type: 'SET_LAYERS', ids: lens.layerIds, opacities: lens.opacities });
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          Lenses
        </h3>
        <span className="text-[10px] text-text-muted">
          {activeLens ? `${activeLens.name} · ${activeLens.layerIds.length} layers` : 'Pick one'}
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-2"
      >
        {lenses.map((lens) => {
          const active = activeLens?.id === lens.id;
          return (
            <motion.button
              key={lens.id}
              variants={staggerItem}
              onClick={() => applyLens(lens)}
              aria-pressed={active}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left shadow-[var(--shadow-surface-1)] transition-all hover:-translate-y-[1px] hover:shadow-[var(--shadow-surface-2)] ${
                active ? 'border-transparent text-white' : 'border-border bg-bg-elevated text-text'
              }`}
              style={active ? { background: lens.color } : undefined}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  active ? 'bg-white/15 text-white' : ''
                }`}
                style={!active ? { background: `${lens.color}14`, color: lens.color } : undefined}
              >
                <lens.Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </div>
              <div className="mt-2 text-sm font-semibold leading-tight">{lens.name}</div>
              <div
                className={`mt-0.5 text-[11px] leading-snug ${
                  active ? 'text-white/80' : 'text-text-muted'
                }`}
              >
                {lens.tagline}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
