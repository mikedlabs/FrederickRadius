import { useSyncExternalStore, useCallback } from 'react';

export type LayerStatus = 'idle' | 'loading' | 'ok' | 'error';

export interface LayerHealth {
  status: LayerStatus;
  fetchedAt: number | null;
  error: string | null;
  retryCount: number;
}

type Listener = () => void;

const store = new Map<string, LayerHealth>();
const listeners = new Set<Listener>();

function defaultHealth(): LayerHealth {
  return { status: 'idle', fetchedAt: null, error: null, retryCount: 0 };
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function setLayerHealth(layerId: string, patch: Partial<LayerHealth>) {
  const prev = store.get(layerId) ?? defaultHealth();
  store.set(layerId, { ...prev, ...patch });
  emit();
}

export function getLayerHealth(layerId: string): LayerHealth {
  return store.get(layerId) ?? defaultHealth();
}

export function resetLayerError(layerId: string) {
  const prev = store.get(layerId) ?? defaultHealth();
  store.set(layerId, { ...prev, status: 'idle', error: null });
  emit();
}

export function getAllLayerHealth(): Map<string, LayerHealth> {
  return store;
}

/** Returns all layers currently in error state */
export function getFailedLayers(): Array<{ layerId: string; health: LayerHealth }> {
  const failed: Array<{ layerId: string; health: LayerHealth }> = [];
  store.forEach((health, layerId) => {
    if (health.status === 'error') failed.push({ layerId, health });
  });
  return failed;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return store;
}

/** Subscribe to the full health store. Re-renders when any layer's health changes. */
export function useLayerHealthStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Subscribe to a single layer's health. */
export function useLayerHealth(layerId: string): LayerHealth {
  const getSnap = useCallback(() => store.get(layerId) ?? defaultHealth(), [layerId]);
  return useSyncExternalStore(subscribe, getSnap);
}
