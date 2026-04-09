import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPlaces, categoryMeta, type Place, type PlaceCategory } from '../../services/api/overpass';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { formatTimeAgo } from '../../lib/time';

const categories = Object.entries(categoryMeta) as [PlaceCategory, typeof categoryMeta[PlaceCategory]][];

export function PlacesPanel() {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('dining');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [expandedPlace, setExpandedPlace] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPlaces(activeCategory)
      .then((data) => {
        setPlaces(data);
        setFetchedAt(Date.now());
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load places'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const meta = categoryMeta[activeCategory];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text">Explore Frederick</h3>
        <p className="mt-1 text-[10px] text-text-muted">
          Places from OpenStreetMap. Review links search external platforms. Data may be incomplete.
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(([id, cat]) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeCategory === id
                ? 'bg-accent text-white'
                : 'bg-bg-surface border border-border text-text-muted hover:text-text hover:bg-bg-hover'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-[10px] text-text-muted">
        <span>
          {loading ? 'Loading...' : `${places.length} places`} {meta.icon}
        </span>
        {fetchedAt && <span>Updated {formatTimeAgo(fetchedAt)}</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
          {error}
          <button onClick={() => setActiveCategory(activeCategory)} className="ml-2 font-medium text-accent hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-bg-surface border border-border" />
          ))}
        </div>
      )}

      {/* Place cards */}
      {!loading && !error && (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-1.5">
          <AnimatePresence>
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                expanded={expandedPlace === place.id}
                onToggle={() => setExpandedPlace(expandedPlace === place.id ? null : place.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && !error && places.length === 0 && (
        <div className="rounded-xl border border-border bg-bg-surface p-4 text-center text-xs text-text-muted">
          No places found for this category. OpenStreetMap coverage may be limited.
        </div>
      )}
    </div>
  );
}

function PlaceCard({ place, expanded, onToggle }: { place: Place; expanded: boolean; onToggle: () => void }) {
  return (
    <motion.div
      variants={staggerItem}
      layout
      className="rounded-xl border border-border bg-bg-surface overflow-hidden"
    >
      <button onClick={onToggle} className="w-full px-3 py-2.5 text-left hover:bg-bg-hover transition-colors">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-sm">{categoryMeta[place.category].icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-text truncate">{place.name}</div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-text-muted">
              {place.subcategory && (
                <span className="capitalize">{place.subcategory}</span>
              )}
              {place.cuisine && place.subcategory !== place.cuisine && (
                <span className="truncate">{place.cuisine}</span>
              )}
            </div>
            {place.address && (
              <div className="mt-0.5 text-[10px] text-text-muted truncate">{place.address}</div>
            )}
          </div>
          <svg
            className={`h-3.5 w-3.5 flex-shrink-0 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="px-3 py-2.5 space-y-2">
              {/* Details */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                {place.openingHours && (
                  <div className="col-span-2">
                    <span className="text-text-muted">Hours: </span>
                    <span className="text-text">{place.openingHours}</span>
                  </div>
                )}
                {place.phone && (
                  <div>
                    <span className="text-text-muted">Phone: </span>
                    <a href={`tel:${place.phone}`} className="text-accent hover:underline">{place.phone}</a>
                  </div>
                )}
                {place.wheelchair && (
                  <div>
                    <span className="text-text-muted">Accessible: </span>
                    <span className="text-text capitalize">{place.wheelchair}</span>
                  </div>
                )}
                {place.outdoorSeating && (
                  <div className="text-text-muted">🌿 Outdoor seating</div>
                )}
                {place.internetAccess && (
                  <div className="text-text-muted">📶 WiFi available</div>
                )}
              </div>

              {/* Review & booking links */}
              <div className="flex flex-wrap gap-1.5">
                {place.reviewLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-white/60 px-2 py-0.5 text-[10px] font-medium text-accent hover:bg-accent hover:text-white transition-colors"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>

              <div className="text-[9px] text-text-muted">
                Data from OpenStreetMap contributors. Links search external platforms — results may not match.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
