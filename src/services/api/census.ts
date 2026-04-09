/**
 * Census TIGER/Line boundary service.
 * Uses the TIGERweb REST API to fetch official municipality boundaries
 * for Frederick County, Maryland (FIPS 24021).
 *
 * Source: U.S. Census Bureau, TIGERweb
 * https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb
 */

import type { GeoJSONCollection } from '../../types';

const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb';

// Incorporated Places layer — contains city/town boundaries
const PLACES_URL = `${TIGERWEB_BASE}/tigerWMS_Current/MapServer/28`;

// Frederick County FIPS = 24021 (State 24, County 021)

let cache: { data: GeoJSONCollection; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — boundaries rarely change

/**
 * Fetch official municipality boundary polygons for Frederick County
 * from the Census Bureau's TIGERweb REST API.
 */
export async function fetchMunicipalityBoundaries(): Promise<GeoJSONCollection> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  // Query for all incorporated places within Frederick County
  // COUNTY field is the 3-digit county FIPS code (021)
  // STATE field is the 2-digit state FIPS code (24)
  const params = new URLSearchParams({
    where: `STATE='24' AND COUNTY='021'`,
    outFields: 'NAME,BASENAME,FUNCSTAT,AREALAND,AREAWATER,GEOID,LSAD,POP100',
    f: 'geojson',
    outSR: '4326',
    returnGeometry: 'true',
  });

  const url = `${PLACES_URL}/query?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TIGERweb error: ${res.status}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(`TIGERweb error: ${json.error.message}`);
  }

  const data = json as GeoJSONCollection;
  cache = { data, timestamp: Date.now() };
  return data;
}

/**
 * Match a TIGERweb place name to our municipality ID.
 * TIGERweb uses BASENAME (e.g., "Frederick") and LSAD for type.
 */
export function matchMunicipalityId(basename: string): string | null {
  const nameMap: Record<string, string> = {
    'Frederick': 'frederick',
    'Thurmont': 'thurmont',
    'Emmitsburg': 'emmitsburg',
    'Middletown': 'middletown',
    'Brunswick': 'brunswick',
    'Walkersville': 'walkersville',
    'Myersville': 'myersville',
    'Woodsboro': 'woodsboro',
    'New Market': 'new-market',
    'Mount Airy': 'mount-airy',
    'Burkittsville': 'burkittsville',
    'Rosemont': 'rosemont',
  };
  return nameMap[basename] ?? null;
}
