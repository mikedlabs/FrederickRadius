import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { slideInRight } from '../../lib/motion';
import { MunicipalityProfile } from '../municipalities/MunicipalityProfile';
import { MunicipalityCompare } from '../municipalities/MunicipalityCompare';
import { WeatherPanel } from '../data-layers/WeatherPanel';
import { WaterLevelsPanel } from '../data-layers/WaterLevelsPanel';
import { TrafficPanel } from '../data-layers/TrafficPanel';
import { ReportsPanel } from '../data-layers/ReportsPanel';
import { CountyDashboard } from '../data-layers/CountyDashboard';
import { ParkingPanel } from '../data-layers/ParkingPanel';
import { MeetingCalendar } from '../civic/MeetingCalendar';
import { RepresentativesPanel } from '../civic/RepresentativeCard';
import { RewardsPanel } from '../rewards/RewardsPanel';
import { AddressIntelligencePanel } from '../shared/AddressIntelligencePanel';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { PlacesPanel } from '../discover/PlacesPanel';
import { EventsPanel } from '../discover/EventsPanel';
import type { RewardsState } from '../../types';
import { productFeatures } from '../../config/features';

const PANEL_DETAILS: Record<string, { kicker: string; title: string; note: string }> = {
  municipality: {
    kicker: 'Municipality profile',
    title: 'Municipality',
    note: 'Reference context, manual civic notes, and local snapshot details stay clearly labeled.',
  },
  weather: {
    kicker: 'Live feed',
    title: 'Weather',
    note: 'National Weather Service forecast context and alerting for Frederick County conditions.',
  },
  water: {
    kicker: 'Live feed',
    title: 'Water Levels',
    note: 'USGS gauge readings paired with flood reference layers and source-aware notes.',
  },
  traffic: {
    kicker: 'Operational context',
    title: 'Traffic',
    note: 'Maryland CHART activity and transportation layers filtered for Frederick-area use.',
  },
  reports: {
    kicker: 'Community reports',
    title: '311 Service Requests',
    note: 'Community-submitted reports should not be confused with official county operations data.',
  },
  parking: {
    kicker: 'Reference inventory',
    title: 'Parking',
    note: 'Parking coverage remains a manual reference surface rather than a live occupancy system.',
  },
  civic: {
    kicker: 'Manual civic snapshot',
    title: 'Civic Directory & Meetings',
    note: 'Meetings and representative listings are useful, but still manually maintained.',
  },
  rewards: {
    kicker: 'Experimental surface',
    title: 'Rewards',
    note: 'Experimental features should never outrank trust, clarity, or civic utility.',
  },
  compare: {
    kicker: 'Reference comparison',
    title: 'Compare Municipalities',
    note: 'Side-by-side municipality context built from local profile snapshots.',
  },
  dashboard: {
    kicker: 'Source intelligence',
    title: 'County Dashboard',
    note: 'A release-facing view of data posture, trust notes, and the product’s current limits.',
  },
  places: {
    kicker: 'Local discovery',
    title: 'Places',
    note: 'Restaurants, shops, venues, and services from OpenStreetMap. Review links search external platforms.',
  },
  events: {
    kicker: 'Local discovery',
    title: 'Events & Things to Do',
    note: 'Curated Frederick events and venues. Check event websites for current schedules.',
  },
  'address-intel': {
    kicker: 'Location context',
    title: 'Location Context',
    note: 'Address results help position the map while jurisdiction and authority remain explicit.',
  },
  search: {
    kicker: 'Search results',
    title: 'Search Results',
    note: 'Convenience results should always be read alongside source and confidence signals.',
  },
};

interface Props {
  rewards: RewardsState;
}

export function SlidePanel({ rewards }: Props) {
  const { state, dispatch } = useAppState();

  if (!state.slidePanelOpen || !state.slidePanelContent) return null;

  const detail = PANEL_DETAILS[state.slidePanelContent] || {
    kicker: 'Detail view',
    title: 'Details',
    note: 'Source-backed panel content with trust notes and supporting context.',
  };

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-[30rem] flex-shrink-0 p-3 pr-4"
    >
      <div className="panel-surface-strong topographic-lines flex h-full w-full flex-col overflow-hidden rounded-[34px]">
        <div className="relative border-b border-border/70 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="eyebrow">{detail.kicker}</div>
              <h2 className="font-display mt-4 text-[2rem] leading-none tracking-tight text-text">
                {detail.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
                {detail.note}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
              className="rounded-2xl border border-border/70 bg-white/60 p-2 text-text-muted transition-colors hover:bg-white/85 hover:text-text"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ErrorBoundary>
            <PanelContent type={state.slidePanelContent} rewards={rewards} />
          </ErrorBoundary>
        </div>
      </div>
    </motion.div>
  );
}

function PanelContent({ type, rewards }: { type: string; rewards: RewardsState }): ReactNode {
  const { state } = useAppState();

  switch (type) {
    case 'municipality':
      return <MunicipalityProfile />;
    case 'weather':
      return <WeatherPanel />;
    case 'water':
      return <WaterLevelsPanel />;
    case 'traffic':
      return <TrafficPanel />;
    case 'reports':
      return <ReportsPanel />;
    case 'parking':
      return <ParkingPanel />;
    case 'civic':
      return <CivicContent />;
    case 'compare':
      return <MunicipalityCompare />;
    case 'dashboard':
      return <CountyDashboard />;
    case 'places':
      return <PlacesPanel />;
    case 'events':
      return <EventsPanel />;
    case 'rewards':
      return productFeatures.experimentalExploration
        ? <RewardsPanel rewards={rewards} />
        : <ExperimentalFeatureNotice />;
    case 'address-intel':
      return state.addressIntel ? (
        <AddressIntelligencePanel
          lat={state.addressIntel.lat}
          lng={state.addressIntel.lng}
          address={state.addressIntel.address}
        />
      ) : (
        <div className="rounded-[24px] border border-border/70 bg-white/60 px-4 py-4 text-sm leading-6 text-text-secondary">
          Search for an address to inspect location context and source-backed overlays.
        </div>
      );
    default:
      return (
        <div className="rounded-[24px] border border-border/70 bg-white/60 px-4 py-4 text-sm leading-6 text-text-secondary">
          Select an item to view details.
        </div>
      );
  }
}

function CivicContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
          Upcoming Meetings
        </h3>
        <MeetingCalendar />
      </div>
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
          Your Representatives
        </h3>
        <RepresentativesPanel />
      </div>
    </div>
  );
}

function ExperimentalFeatureNotice() {
  return (
    <div className="rounded-[24px] border border-border/70 bg-white/60 p-4 text-sm leading-6 text-text-secondary">
      Exploration rewards are disabled in the trust-first build. If they return, they should stay clearly experimental and never outrank civic utility.
    </div>
  );
}
