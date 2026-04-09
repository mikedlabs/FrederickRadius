/**
 * Local events service for Frederick County.
 * Uses Eventbrite's public search (no API key needed for basic discovery)
 * and links to local event calendars.
 */

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  endDate?: string;
  venue: string;
  address?: string;
  lat?: number;
  lng?: number;
  category: EventCategory;
  url: string;
  source: EventSource;
  imageUrl?: string;
  price?: string;
}

export type EventCategory = 'music' | 'food' | 'arts' | 'community' | 'sports' | 'markets' | 'nightlife' | 'family' | 'other';
export type EventSource = 'curated' | 'community-calendar';

/**
 * Curated recurring events and known Frederick staples.
 * These are real events/venues that happen regularly.
 * Source: Visit Frederick, Downtown Frederick Partnership, venue websites.
 */
const recurringEvents: LocalEvent[] = [
  {
    id: 'first-saturday',
    title: 'First Saturday',
    description: 'Downtown Frederick comes alive on the first Saturday of every month with gallery openings, live music, special retail events, and restaurant specials along Market and Patrick streets.',
    date: 'First Saturday monthly',
    time: '5:00 PM - 9:00 PM',
    venue: 'Downtown Frederick',
    address: 'Market St, Frederick, MD',
    lat: 39.4143,
    lng: -77.4105,
    category: 'arts',
    url: 'https://www.downtownfrederick.org/first-saturday',
    source: 'curated',
    price: 'Free',
  },
  {
    id: 'frederick-farmers-market',
    title: 'Frederick City Farmers Market',
    description: 'One of Maryland\'s largest and oldest farmers markets, featuring local produce, baked goods, meats, cheeses, flowers, and artisan crafts from Frederick County farms.',
    date: 'Saturdays, April - November',
    time: '8:00 AM - 1:00 PM',
    venue: 'Frederick Fairgrounds',
    address: '797 E Patrick St, Frederick, MD',
    lat: 39.4149,
    lng: -77.3993,
    category: 'markets',
    url: 'https://frederickcountyfarmersmarket.com',
    source: 'curated',
    price: 'Free admission',
  },
  {
    id: 'in-the-street',
    title: 'In The Street Festival',
    description: 'Frederick\'s signature fall street festival transforms Market Street into a pedestrian celebration with over 350 vendors, live entertainment stages, and local food.',
    date: 'September (annual)',
    time: '10:00 AM - 6:00 PM',
    venue: 'Market Street, Downtown Frederick',
    lat: 39.4143,
    lng: -77.4105,
    category: 'community',
    url: 'https://www.celebratefrederick.com',
    source: 'curated',
    price: 'Free',
  },
  {
    id: 'alive-at-five',
    title: 'Alive @ Five',
    description: 'Free summer concert series in Carroll Creek Linear Park featuring local and regional bands every Thursday evening during summer months.',
    date: 'Thursdays, June - August',
    time: '5:00 PM - 8:00 PM',
    venue: 'Carroll Creek Linear Park',
    address: 'Carroll Creek Park, Frederick, MD',
    lat: 39.4131,
    lng: -77.4117,
    category: 'music',
    url: 'https://www.downtownfrederick.org',
    source: 'curated',
    price: 'Free',
  },
  {
    id: 'weinberg-center',
    title: 'Weinberg Center for the Arts',
    description: 'Historic 1926 theater hosting live performances including concerts, comedy, theater, film screenings, and community events year-round.',
    date: 'Year-round',
    venue: 'Weinberg Center for the Arts',
    address: '20 W Patrick St, Frederick, MD',
    lat: 39.4146,
    lng: -77.4118,
    category: 'arts',
    url: 'https://www.weinbergcenter.org',
    source: 'curated',
  },
  {
    id: 'flying-dog',
    title: 'Flying Dog Brewery Events',
    description: 'Frederick\'s craft brewery hosts taproom events, live music, food trucks, and seasonal beer releases at their production facility.',
    date: 'Year-round',
    venue: 'Flying Dog Brewery',
    address: '4607 Wedgewood Blvd, Frederick, MD',
    lat: 39.4382,
    lng: -77.3771,
    category: 'nightlife',
    url: 'https://www.flyingdog.com',
    source: 'curated',
  },
  {
    id: 'attaboy-beer',
    title: 'Attaboy Beer',
    description: 'Local craft brewery with a family-friendly taproom, outdoor space, food trucks, and regular live music and trivia nights.',
    date: 'Year-round',
    venue: 'Attaboy Beer',
    address: '32 E Patrick St, Frederick, MD',
    lat: 39.4147,
    lng: -77.4106,
    category: 'nightlife',
    url: 'https://www.attaboybeer.com',
    source: 'curated',
  },
  {
    id: 'fam-kemptown',
    title: 'Frederick Fairgrounds Events',
    description: 'The Great Frederick Fair and year-round events including concerts, car shows, gun shows, antique markets, and community expos.',
    date: 'Year-round (Great Frederick Fair in September)',
    venue: 'Frederick Fairgrounds',
    address: '797 E Patrick St, Frederick, MD',
    lat: 39.4149,
    lng: -77.3993,
    category: 'community',
    url: 'https://thegreatfrederickfair.com',
    source: 'curated',
  },
  {
    id: 'marylands-national-museum',
    title: 'National Museum of Civil War Medicine',
    description: 'The only museum in the world dedicated to the medical story of the American Civil War. Permanent and rotating exhibits.',
    date: 'Year-round',
    time: '10:00 AM - 5:00 PM',
    venue: 'National Museum of Civil War Medicine',
    address: '48 E Patrick St, Frederick, MD',
    lat: 39.4148,
    lng: -77.4102,
    category: 'arts',
    url: 'https://www.civilwarmed.org',
    source: 'curated',
    price: '$12 adults',
  },
  {
    id: 'schifferstadt',
    title: 'Schifferstadt Architectural Museum',
    description: 'One of the finest examples of German Colonial architecture in America (1756). Tours, seasonal events, and heritage programs.',
    date: 'April - December',
    venue: 'Schifferstadt',
    address: '1110 Rosemont Ave, Frederick, MD',
    lat: 39.4236,
    lng: -77.4197,
    category: 'arts',
    url: 'https://www.fredericklandmarks.org',
    source: 'curated',
    price: '$5 suggested',
  },
  {
    id: 'monocacy-battlefield',
    title: 'Monocacy National Battlefield',
    description: 'Site of the Civil War\'s "Battle That Saved Washington." Walking trails, visitor center, and ranger programs run by the National Park Service.',
    date: 'Year-round',
    time: '9:00 AM - 5:00 PM',
    venue: 'Monocacy National Battlefield',
    address: '5201 Urbana Pike, Frederick, MD',
    lat: 39.3847,
    lng: -77.3929,
    category: 'community',
    url: 'https://www.nps.gov/mono',
    source: 'curated',
    price: 'Free',
  },
];

/** External calendar links for Frederick events */
export const eventCalendarLinks = [
  { name: 'Visit Frederick Events', url: 'https://www.visitfrederick.org/events/', icon: '📅' },
  { name: 'Downtown Frederick Partnership', url: 'https://www.downtownfrederick.org/events', icon: '🏙️' },
  { name: 'Frederick Magazine Events', url: 'https://www.frederickmagazine.com/events/', icon: '📰' },
  { name: 'Frederick News-Post Events', url: 'https://www.fredericknewspost.com/calendar/', icon: '🗞️' },
  { name: 'Eventbrite Frederick', url: 'https://www.eventbrite.com/d/md--frederick/events/', icon: '🎫' },
  { name: 'Frederick County Government', url: 'https://frederickcountymd.gov/calendar.aspx', icon: '🏛️' },
];

export function getLocalEvents(): LocalEvent[] {
  return recurringEvents;
}

export function getEventsByCategory(category: EventCategory): LocalEvent[] {
  return recurringEvents.filter((e) => e.category === category);
}

export const eventCategoryMeta: Record<EventCategory, { label: string; icon: string }> = {
  music: { label: 'Music & Concerts', icon: '🎵' },
  food: { label: 'Food & Drink', icon: '🍽️' },
  arts: { label: 'Arts & Culture', icon: '🎨' },
  community: { label: 'Community', icon: '🤝' },
  sports: { label: 'Sports & Outdoors', icon: '⚽' },
  markets: { label: 'Markets & Fairs', icon: '🧺' },
  nightlife: { label: 'Nightlife & Breweries', icon: '🍺' },
  family: { label: 'Family & Kids', icon: '👨‍👩‍👧‍👦' },
  other: { label: 'Other', icon: '📌' },
};
