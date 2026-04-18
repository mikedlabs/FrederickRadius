import type { ComponentType } from 'react';
import {
  Compass,
  Flame,
  Gem,
  HardHat,
  Landmark,
  Route,
  Trees,
  Waves,
} from 'lucide-react';

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

export interface Lens {
  id: string;
  name: string;
  tagline: string;
  /** Accent used for the lens tile + chip when active. */
  color: string;
  /** Lucide icon used on the lens tile. */
  Icon: LucideIcon;
  /** Layer ids this lens switches on, in render order (first on top). */
  layerIds: string[];
  /** Optional per-layer opacity overrides (0–100). Defaults to 100. */
  opacities?: Record<string, number>;
}

/**
 * Curated lenses replace the 90-item flat list for the common case.
 * Each lens is a pre-composed question: "Everyday? Outdoors? Flood risk?"
 * Advanced users can still toggle individual layers behind "All layers".
 */
export const lenses: Lens[] = [
  {
    id: 'everyday',
    name: 'Everyday',
    tagline: 'Groceries, libraries, hospitals, markets.',
    color: '#8B1F2F',
    Icon: Compass,
    layerIds: ['hospitals', 'libraries', 'farmers-markets', 'post-offices', 'shopping'],
    opacities: { shopping: 75, 'post-offices': 70 },
  },
  {
    id: 'outdoors',
    name: 'Outdoors',
    tagline: 'Parks, trails, streams, bike paths.',
    color: '#2F5238',
    Icon: Trees,
    layerIds: ['park-boundaries', 'trails', 'city-bike-paths', 'parks'],
    opacities: { 'park-boundaries': 70 },
  },
  {
    id: 'emergency',
    name: 'Emergency',
    tagline: 'Fire, police, shelters, flood points.',
    color: '#B91C1C',
    Icon: Flame,
    layerIds: ['fire-stations', 'law-enforcement', 'shelters', 'flood-points'],
  },
  {
    id: 'flood-risk',
    name: 'Flood risk',
    tagline: 'FEMA floodplain, high water, road flood points.',
    color: '#1D4ED8',
    Icon: Waves,
    layerIds: ['fema-floodplain', 'high-water', 'flood-points'],
    opacities: { 'fema-floodplain': 55 },
  },
  {
    id: 'civic',
    name: 'Civic',
    tagline: 'Schools, government, polling, precincts.',
    color: '#6F1825',
    Icon: Landmark,
    layerIds: ['schools', 'gov-facilities', 'polling-places', 'election-precincts'],
    opacities: { 'election-precincts': 40 },
  },
  {
    id: 'mobility',
    name: 'Mobility',
    tagline: 'Transit, trails, bikeways, EV charging.',
    color: '#0E7490',
    Icon: Route,
    layerIds: ['transit-routes', 'transit-stops', 'trails', 'bikeway-routes', 'ev-chargers'],
    opacities: { 'transit-routes': 80 },
  },
  {
    id: 'development',
    name: 'Development',
    tagline: 'Zoning, growth boundaries, dev pipeline.',
    color: '#8C6310',
    Icon: HardHat,
    layerIds: ['zoning', 'growth-boundaries', 'dev-pipeline', 'land-use'],
    opacities: { zoning: 50, 'land-use': 45, 'growth-boundaries': 40 },
  },
  {
    id: 'heritage',
    name: 'Heritage',
    tagline: 'Historic sites, districts, cemeteries, roads.',
    color: '#B45309',
    Icon: Gem,
    layerIds: ['historic-sites', 'historic-preservation', 'cemeteries', 'historic-roads'],
    opacities: { 'historic-preservation': 55 },
  },
];

export function getLensById(id: string | null | undefined): Lens | undefined {
  if (!id) return undefined;
  return lenses.find((l) => l.id === id);
}

/**
 * Identify the lens whose layer set exactly matches the current active set,
 * ignoring order. Returns null when the user has a custom composition.
 */
export function detectActiveLens(activeLayerIds: string[]): Lens | null {
  if (activeLayerIds.length === 0) return null;
  const active = new Set(activeLayerIds);
  for (const lens of lenses) {
    if (lens.layerIds.length !== active.size) continue;
    if (lens.layerIds.every((id) => active.has(id))) return lens;
  }
  return null;
}
