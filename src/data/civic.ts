import type { Meeting, Representative } from '../types';

export const countyRepresentatives: Representative[] = [
  { name: 'Jessica Fitzwater', title: 'County Executive', level: 'county', phone: '301-600-1100', website: 'https://www.frederickcountymd.gov/countyexecutive' },
  { name: 'M.C. Keegan-Ayer', title: 'Council President', level: 'county', district: 'At-Large' },
  { name: 'Jerry Donald', title: 'Council Vice President', level: 'county', district: 'District 3' },
  { name: 'Steve McKay', title: 'Council Member', level: 'county', district: 'District 1' },
  { name: 'Renee Knapp', title: 'Council Member', level: 'county', district: 'District 2' },
  { name: 'Blue Denton', title: 'Council Member', level: 'county', district: 'District 4' },
  { name: 'Dan Horrigan', title: 'Council Member', level: 'county', district: 'District 5' },
  { name: 'Kavonte Duckett', title: 'Council Member', level: 'county', district: 'At-Large' },
];

export const stateRepresentatives: Representative[] = [
  { name: 'Karen Lewis Young', title: 'State Senator', level: 'state', district: 'District 3', party: 'D' },
  { name: 'William Folden', title: 'Delegate', level: 'state', district: 'District 3A', party: 'R' },
  { name: 'Ken Kerr', title: 'Delegate', level: 'state', district: 'District 3A', party: 'D' },
  { name: 'Carol Krimm', title: 'Delegate', level: 'state', district: 'District 3A', party: 'D' },
];

export const federalRepresentatives: Representative[] = [
  { name: 'David Trone', title: 'U.S. Representative', level: 'federal', district: 'MD-6', party: 'D', website: 'https://trone.house.gov' },
  { name: 'Chris Van Hollen', title: 'U.S. Senator', level: 'federal', party: 'D' },
  { name: 'Ben Cardin', title: 'U.S. Senator', level: 'federal', party: 'D' },
];

export const upcomingMeetings: Meeting[] = [
  {
    id: 'cc-1',
    title: 'County Council Regular Session',
    body: 'Frederick County Council',
    date: '2026-04-14',
    time: '5:30 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
  },
  {
    id: 'cc-2',
    title: 'County Council Regular Session',
    body: 'Frederick County Council',
    date: '2026-04-21',
    time: '5:30 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
  },
  {
    id: 'pc-1',
    title: 'Planning Commission Meeting',
    body: 'Frederick County Planning Commission',
    date: '2026-04-08',
    time: '7:00 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'planning',
  },
  {
    id: 'pc-2',
    title: 'Planning Commission Meeting',
    body: 'Frederick County Planning Commission',
    date: '2026-04-22',
    time: '7:00 PM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'planning',
  },
  {
    id: 'ba-1',
    title: 'Board of Appeals Hearing',
    body: 'Frederick County Board of Appeals',
    date: '2026-04-15',
    time: '9:00 AM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'appeals',
  },
  {
    id: 'ws-1',
    title: 'County Council Work Session',
    body: 'Frederick County Council',
    date: '2026-04-09',
    time: '10:00 AM',
    location: 'Winchester Hall, 12 E Church St, Frederick',
    type: 'council',
  },
];
