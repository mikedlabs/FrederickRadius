import { AnimatePresence, motion } from 'framer-motion';
import { useLayerHealthStore, getFailedLayers, resetLayerError } from '../../hooks/useLayerHealth';
import { mapLayers } from '../../data/layers';

export function LayerHealthBanner() {
  useLayerHealthStore(); // subscribe to changes
  const failed = getFailedLayers();

  if (failed.length === 0) return null;

  const names = failed
    .map(({ layerId }) => mapLayers.find((l) => l.id === layerId)?.name ?? layerId)
    .slice(0, 3);

  const extra = failed.length - names.length;
  const label = extra > 0
    ? `${names.join(', ')} +${extra} more`
    : names.join(', ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-1/2 top-3 z-20 -translate-x-1/2"
      >
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 backdrop-blur-md px-3 py-2 shadow-lg">
          <span className="text-xs text-danger font-medium">
            {failed.length === 1 ? '1 layer failed' : `${failed.length} layers failed`}
          </span>
          <span className="text-[10px] text-text-muted max-w-[200px] truncate" title={label}>
            {label}
          </span>
          <button
            onClick={() => failed.forEach(({ layerId }) => resetLayerError(layerId))}
            className="rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-medium text-accent hover:bg-white transition-colors"
          >
            Retry all
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
