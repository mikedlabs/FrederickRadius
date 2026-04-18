import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers as LayersIcon, X } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { layerCategories, mapLayers } from '../../data/layers';
import { LayerItem } from './LayerItem';
import { LensGrid } from './LensGrid';
import { slideInRight } from '../../lib/motion';

export function LayerPanel() {
  const { state, dispatch } = useAppState();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [allOpen, setAllOpen] = useState(false);

  const activeLayers = state.layerOrder
    .map((id) => mapLayers.find((l) => l.id === id))
    .filter(Boolean) as typeof mapLayers;

  const activeCount = state.activeLayers.length;
  const totalCount = mapLayers.length;

  function toggleCategory(catId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }

  const grouped = layerCategories.map((cat) => ({
    ...cat,
    layers: mapLayers.filter((l) => l.category === cat.id && !state.activeLayers.includes(l.id)),
  }));

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-80 flex-shrink-0 flex-col border-l border-border bg-bg"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text">
            <LayersIcon className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold">Data Layers</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-subtle text-accent text-[10px] font-medium px-2 py-0.5 tabular-nums">
              {activeCount} active
            </span>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_LAYER_PANEL' })}
              className="rounded p-1 text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
              aria-label="Close layer panel"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <LensGrid />

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_LAYERS' })}
            className="w-full rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-bg-hover hover:text-text transition-colors"
          >
            Clear all {activeCount} layer{activeCount === 1 ? '' : 's'}
          </button>
        )}

        {/* Active layer detail (opacity sliders, ordering) */}
        {activeLayers.length > 0 && (
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              Active layers
            </h3>
            <div className="space-y-1.5">
              <AnimatePresence>
                {activeLayers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    opacity={state.layerOpacity[layer.id] ?? 100}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* All layers disclosure */}
        <div className="border-t border-border pt-3">
          <button
            onClick={() => setAllOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded px-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hover:text-text transition-colors"
            aria-expanded={allOpen}
          >
            <span>All layers ({totalCount})</span>
            <motion.span animate={{ rotate: allOpen ? 90 : 0 }} className="flex h-3 w-3 items-center justify-center">
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {allOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1">
                  {grouped.map((group) => {
                    if (group.layers.length === 0) return null;
                    const isExpanded = expandedCategories.has(group.id);
                    return (
                      <div key={group.id}>
                        <button
                          onClick={() => toggleCategory(group.id)}
                          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
                        >
                          <motion.span
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            className="flex h-3 w-3 flex-shrink-0 items-center justify-center"
                          >
                            <ChevronRight className="h-3 w-3" strokeWidth={2} />
                          </motion.span>
                          <span className="flex-1 text-left">{group.name}</span>
                          <span className="text-[10px] tabular-nums text-text-muted">{group.layers.length}</span>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-2">
                                {group.layers.map((layer) => (
                                  <button
                                    key={layer.id}
                                    onClick={() => dispatch({ type: 'TOGGLE_LAYER', layerId: layer.id })}
                                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-text-secondary hover:bg-bg-hover hover:text-text transition-colors"
                                  >
                                    <span
                                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                      style={{ background: layer.color }}
                                      aria-hidden
                                    />
                                    <span className="truncate">{layer.name}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
