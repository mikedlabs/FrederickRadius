/**
 * Overpass API service — queries OpenStreetMap for local places.
 * Free, no API key. Rate-limited; cache aggressively.
 */

export interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  subcategory: string;
  cuisine?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  address?: string;
  wheelchair?: string;
  outdoorSeating?: boolean;
  internetAccess?: boolean;
  reviewLinks: ReviewLink[];
}

export interface ReviewLink {
  platform: 'opentable' | 'yelp' | 'google' | 'tripadvisor' | 'website';
  label: string;
  url: string;
}

export type PlaceCategory =
  | 'dining'
  | 'coffee'
  | 'bars'
  | 'shopping'
  | 'entertainment'
  | 'fitness'
  | 'services'
  | 'lodging'
  | 'groceries'
  | 'beauty';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Frederick County bounding box (tight around City of Frederick for relevance)
const FREDERICK_BBOX = '39.35,-77.50,39.48,-77.35';

const cache = new Map<string, { data: Place[]; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const categoryQueries: Record<PlaceCategory, string> = {
  dining: `
    node["amenity"~"restaurant|fast_food|food_court"](${FREDERICK_BBOX});
    way["amenity"~"restaurant|fast_food|food_court"](${FREDERICK_BBOX});
  `,
  coffee: `
    node["amenity"="cafe"](${FREDERICK_BBOX});
    way["amenity"="cafe"](${FREDERICK_BBOX});
    node["cuisine"="coffee"](${FREDERICK_BBOX});
  `,
  bars: `
    node["amenity"~"bar|pub|biergarten|nightclub"](${FREDERICK_BBOX});
    way["amenity"~"bar|pub|biergarten|nightclub"](${FREDERICK_BBOX});
  `,
  shopping: `
    node["shop"~"clothes|boutique|gift|books|department_store|variety_store|art|antiques|jewelry|electronics"](${FREDERICK_BBOX});
    way["shop"~"clothes|boutique|gift|books|department_store|variety_store|art|antiques|jewelry|electronics"](${FREDERICK_BBOX});
  `,
  entertainment: `
    node["amenity"~"cinema|theatre|arts_centre|nightclub|music_venue"](${FREDERICK_BBOX});
    way["amenity"~"cinema|theatre|arts_centre|nightclub|music_venue"](${FREDERICK_BBOX});
    node["leisure"~"bowling_alley|escape_game|amusement_arcade|miniature_golf"](${FREDERICK_BBOX});
    way["tourism"~"museum|gallery|attraction"](${FREDERICK_BBOX});
    node["tourism"~"museum|gallery|attraction"](${FREDERICK_BBOX});
  `,
  fitness: `
    node["leisure"~"fitness_centre|sports_centre|swimming_pool"](${FREDERICK_BBOX});
    way["leisure"~"fitness_centre|sports_centre|swimming_pool"](${FREDERICK_BBOX});
    node["sport"="yoga"](${FREDERICK_BBOX});
  `,
  services: `
    node["amenity"~"bank|pharmacy|dentist|doctors|veterinary|car_repair|dry_cleaning|post_office"](${FREDERICK_BBOX});
    way["amenity"~"bank|pharmacy|dentist|doctors|veterinary|car_repair|dry_cleaning|post_office"](${FREDERICK_BBOX});
  `,
  lodging: `
    node["tourism"~"hotel|motel|hostel|guest_house|bed_and_breakfast"](${FREDERICK_BBOX});
    way["tourism"~"hotel|motel|hostel|guest_house|bed_and_breakfast"](${FREDERICK_BBOX});
  `,
  groceries: `
    node["shop"~"supermarket|convenience|greengrocer|bakery|butcher|deli|farm"](${FREDERICK_BBOX});
    way["shop"~"supermarket|convenience|greengrocer|bakery|butcher|deli|farm"](${FREDERICK_BBOX});
  `,
  beauty: `
    node["shop"~"hairdresser|beauty|tattoo|massage"](${FREDERICK_BBOX});
    way["shop"~"hairdresser|beauty|tattoo|massage"](${FREDERICK_BBOX});
    node["amenity"="spa"](${FREDERICK_BBOX});
  `,
};

function buildReviewLinks(tags: Record<string, string>, name: string): ReviewLink[] {
  const links: ReviewLink[] = [];
  const encoded = encodeURIComponent(`${name} Frederick MD`);

  if (tags.website) {
    links.push({ platform: 'website', label: 'Website', url: tags.website });
  }

  // Generate search links for major review platforms
  links.push({ platform: 'google', label: 'Google', url: `https://www.google.com/search?q=${encoded}+reviews` });
  links.push({ platform: 'yelp', label: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encoded}` });

  if (tags.amenity === 'restaurant' || tags.cuisine) {
    links.push({ platform: 'opentable', label: 'OpenTable', url: `https://www.opentable.com/s?term=${encoded}` });
  }

  if (tags.tourism || tags.amenity === 'restaurant') {
    links.push({ platform: 'tripadvisor', label: 'TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${encoded}` });
  }

  return links;
}

function resolveSubcategory(tags: Record<string, string>): string {
  if (tags.cuisine) return tags.cuisine.split(';')[0].replace(/_/g, ' ');
  if (tags.shop) return tags.shop.replace(/_/g, ' ');
  if (tags.amenity) return tags.amenity.replace(/_/g, ' ');
  if (tags.leisure) return tags.leisure.replace(/_/g, ' ');
  if (tags.tourism) return tags.tourism.replace(/_/g, ' ');
  return '';
}

function buildAddress(tags: Record<string, string>): string | undefined {
  const parts = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

function parseElement(el: OverpassElement, category: PlaceCategory): Place | null {
  const tags = el.tags ?? {};
  const name = tags.name;
  if (!name) return null;

  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat == null || lng == null) return null;

  return {
    id: el.id,
    name,
    lat,
    lng,
    category,
    subcategory: resolveSubcategory(tags),
    cuisine: tags.cuisine?.replace(/;/g, ', ').replace(/_/g, ' '),
    phone: tags.phone ?? tags['contact:phone'],
    website: tags.website ?? tags['contact:website'],
    openingHours: tags.opening_hours,
    address: buildAddress(tags),
    wheelchair: tags.wheelchair,
    outdoorSeating: tags.outdoor_seating === 'yes',
    internetAccess: tags.internet_access === 'wlan' || tags.internet_access === 'yes',
    reviewLinks: buildReviewLinks(tags, name),
  };
}

export async function fetchPlaces(category: PlaceCategory): Promise<Place[]> {
  const cached = cache.get(category);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const query = `[out:json][timeout:15];(${categoryQueries[category]});out center;`;
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
  const json = await res.json();

  const places = (json.elements as OverpassElement[])
    .map((el) => parseElement(el, category))
    .filter((p): p is Place => p !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  cache.set(category, { data: places, timestamp: Date.now() });
  return places;
}

export const categoryMeta: Record<PlaceCategory, { label: string; icon: string; color: string }> = {
  dining: { label: 'Restaurants', icon: '🍽️', color: '#EF4444' },
  coffee: { label: 'Coffee & Tea', icon: '☕', color: '#92400E' },
  bars: { label: 'Bars & Nightlife', icon: '🍸', color: '#7C3AED' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  entertainment: { label: 'Entertainment', icon: '🎭', color: '#F59E0B' },
  fitness: { label: 'Fitness & Wellness', icon: '💪', color: '#10B981' },
  services: { label: 'Services', icon: '🏪', color: '#6366F1' },
  lodging: { label: 'Hotels & Lodging', icon: '🏨', color: '#0891B2' },
  groceries: { label: 'Groceries & Markets', icon: '🥬', color: '#16A34A' },
  beauty: { label: 'Beauty & Spa', icon: '💇', color: '#F472B6' },
};
