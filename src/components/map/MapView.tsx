import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useAppState } from '../../hooks/useAppState';
import { municipalityBoundaries, municipalities } from '../../data/municipalities';
import { FREDERICK_COUNTY_CENTER, FREDERICK_COUNTY_ZOOM } from '../../data/municipalities';
import { fetchArcGISLayer, getFeatureLabel, getFeatureDetails } from '../../services/api/arcgis';

const DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: 'Dark',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const loadedLayersRef = useRef<Set<string>>(new Set());
  const { state, layers, dispatch } = useAppState();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: DARK_STYLE,
      center: FREDERICK_COUNTY_CENTER,
      zoom: FREDERICK_COUNTY_ZOOM,
      minZoom: 8,
      maxZoom: 18,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left');

    map.on('load', () => {
      // Add municipality boundaries
      map.addSource('municipalities', {
        type: 'geojson',
        data: municipalityBoundaries,
      });

      map.addLayer({
        id: 'municipality-fills',
        type: 'fill',
        source: 'municipalities',
        paint: {
          'fill-color': '#3B82F6',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.25,
            0.1,
          ],
        },
      });

      map.addLayer({
        id: 'municipality-borders',
        type: 'line',
        source: 'municipalities',
        paint: {
          'line-color': '#3B82F6',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            2.5,
            1.5,
          ],
          'line-opacity': 0.7,
        },
      });

      map.addLayer({
        id: 'municipality-labels',
        type: 'symbol',
        source: 'municipalities',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-anchor': 'center',
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': '#F0ECE6',
          'text-halo-color': '#0A0A0A',
          'text-halo-width': 2,
        },
      });

      // Municipality hover
      let hoveredId: number | null = null;

      map.on('mousemove', 'municipality-fills', (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          if (hoveredId !== null) {
            map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: false });
          }
          hoveredId = e.features[0].id as number;
          map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: true });
        }
      });

      map.on('mouseleave', 'municipality-fills', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState({ source: 'municipalities', id: hoveredId }, { hover: false });
          hoveredId = null;
        }
      });

      map.on('click', 'municipality-fills', (e) => {
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties;
          if (props?.id) {
            dispatch({ type: 'SELECT_MUNICIPALITY', id: props.id as string });
          }
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync GIS layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    for (const layer of layers) {
      const sourceId = `gis-${layer.id}`;
      const layerId = `gis-layer-${layer.id}`;

      if (layer.visible && !loadedLayersRef.current.has(layer.id)) {
        // Load and add layer
        loadedLayersRef.current.add(layer.id);

        fetchArcGISLayer(layer.endpoint)
          .then((geojson) => {
            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, { type: 'geojson', data: geojson });

              if (layer.type === 'point') {
                map.addLayer({
                  id: layerId,
                  type: 'circle',
                  source: sourceId,
                  paint: {
                    'circle-radius': 6,
                    'circle-color': layer.color,
                    'circle-stroke-color': '#0A0A0A',
                    'circle-stroke-width': 1.5,
                    'circle-opacity': 0.9,
                  },
                });
              } else if (layer.type === 'polygon') {
                map.addLayer({
                  id: layerId,
                  type: 'fill',
                  source: sourceId,
                  paint: {
                    'fill-color': layer.color,
                    'fill-opacity': 0.15,
                  },
                });
                map.addLayer({
                  id: `${layerId}-outline`,
                  type: 'line',
                  source: sourceId,
                  paint: {
                    'line-color': layer.color,
                    'line-width': 1.5,
                    'line-opacity': 0.6,
                  },
                });
              } else if (layer.type === 'line') {
                map.addLayer({
                  id: layerId,
                  type: 'line',
                  source: sourceId,
                  paint: {
                    'line-color': layer.color,
                    'line-width': 2.5,
                    'line-opacity': 0.8,
                  },
                });
              }

              // Click handler for point features
              if (layer.type === 'point') {
                map.on('click', layerId, (e) => {
                  if (e.features && e.features.length > 0) {
                    const props = e.features[0].properties || {};
                    const label = getFeatureLabel(props as Record<string, unknown>);
                    const details = getFeatureDetails(props as Record<string, unknown>);

                    const html = `
                      <div style="max-width: 250px;">
                        <div style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">${layer.icon} ${label}</div>
                        <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 6px;">${layer.name}</div>
                        ${details.map((d) => `<div style="font-size: 12px; margin-bottom: 2px;"><span style="color: #6B7280;">${d.key}:</span> ${d.value}</div>`).join('')}
                      </div>
                    `;

                    if (popupRef.current) popupRef.current.remove();
                    popupRef.current = new maplibregl.Popup({ closeButton: true })
                      .setLngLat(e.lngLat)
                      .setHTML(html)
                      .addTo(map);
                  }
                });

                map.on('mouseenter', layerId, () => {
                  map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', layerId, () => {
                  map.getCanvas().style.cursor = '';
                });
              }
            }
          })
          .catch((err) => {
            console.warn(`Failed to load layer ${layer.id}:`, err);
            loadedLayersRef.current.delete(layer.id);
          });
      } else if (!layer.visible && map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
        if (map.getLayer(`${layerId}-outline`)) {
          map.setLayoutProperty(`${layerId}-outline`, 'visibility', 'none');
        }
      } else if (layer.visible && map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        if (map.getLayer(`${layerId}-outline`)) {
          map.setLayoutProperty(`${layerId}-outline`, 'visibility', 'visible');
        }
      }
    }
  }, [layers]);

  // Fly to selected municipality
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !state.selectedMunicipality) return;

    const muni = municipalities.find((m) => m.id === state.selectedMunicipality);
    if (muni) {
      map.flyTo({
        center: muni.centroid,
        zoom: muni.area > 5 ? 12 : 13.5,
        duration: 1200,
      });
    }
  }, [state.selectedMunicipality]);

  const flyTo = useCallback((lng: number, lat: number, zoom = 14) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 1000 });
  }, []);

  // Expose flyTo for search
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => { delete (window as unknown as Record<string, unknown>).__mapFlyTo; };
  }, [flyTo]);

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
}
