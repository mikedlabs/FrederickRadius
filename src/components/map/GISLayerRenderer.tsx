import { Source, Layer } from 'react-map-gl/mapbox';
import { useAppState } from '../../hooks/useAppState';
import { useGISLayer } from '../../hooks/useGISLayer';
import type { MapLayer } from '../../types';

export function GISLayerRenderer() {
  const { layers, state } = useAppState();
  const visibleLayers = layers.filter((l) => l.visible);

  return (
    <>
      {visibleLayers.map((layer) => (
        <GISLayer
          key={layer.id}
          layer={layer}
          opacity={(state.layerOpacity[layer.id] ?? 100) / 100}
        />
      ))}
    </>
  );
}

function GISLayer({ layer, opacity }: { layer: MapLayer; opacity: number }) {
  const { data } = useGISLayer(layer.endpoint, true);
  if (!data) return null;

  const sourceId = `gis-${layer.id}`;

  if (layer.type === 'point') {
    return (
      <Source id={sourceId} type="geojson" data={data} cluster clusterMaxZoom={14} clusterRadius={50}>
        <Layer
          id={`${sourceId}-clusters`}
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': layer.color,
            'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 50, 25],
            'circle-opacity': 0.7 * opacity,
            'circle-stroke-color': '#0A0A0A',
            'circle-stroke-width': 2,
          }}
        />
        <Layer
          id={`${sourceId}-cluster-count`}
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          }}
          paint={{ 'text-color': '#F0ECE6', 'text-opacity': opacity }}
        />
        <Layer
          id={`${sourceId}-points`}
          type="circle"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3, 14, 7],
            'circle-color': layer.color,
            'circle-stroke-color': '#0A0A0A',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.9 * opacity,
          }}
        />
      </Source>
    );
  }

  if (layer.type === 'polygon') {
    return (
      <Source id={sourceId} type="geojson" data={data}>
        <Layer
          id={`${sourceId}-fill`}
          type="fill"
          paint={{ 'fill-color': layer.color, 'fill-opacity': 0.12 * opacity }}
        />
        <Layer
          id={`${sourceId}-outline`}
          type="line"
          paint={{ 'line-color': layer.color, 'line-width': 1.5, 'line-opacity': 0.5 * opacity }}
        />
      </Source>
    );
  }

  if (layer.type === 'line') {
    return (
      <Source id={sourceId} type="geojson" data={data}>
        <Layer
          id={`${sourceId}-line`}
          type="line"
          paint={{ 'line-color': layer.color, 'line-width': 2.5, 'line-opacity': 0.8 * opacity }}
        />
      </Source>
    );
  }

  return null;
}
