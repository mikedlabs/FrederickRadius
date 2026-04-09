import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { useRewards } from '../../hooks/useRewards';
import { MapView } from '../map/MapView';
import { Sidebar } from './Sidebar';
import { SlidePanel } from './SlidePanel';
import { BottomSheet, type SnapPoint } from './BottomSheet';
import { CommandPalette } from '../shared/CommandPalette';
import { CountyPulse } from '../shared/CountyPulse';
import { LayerPanel } from '../layers/LayerPanel';
import { LiveActivityFeed } from '../shared/LiveActivityFeed';
import { WelcomeScreen } from '../shared/WelcomeScreen';
import { GuidedTour } from '../shared/GuidedTour';
import { SearchBar } from './SearchBar';
import { HomeFeed } from '../home/HomeFeed';

// Mobile panel content (rendered inside BottomSheet)
import { WeatherPanel } from '../data-layers/WeatherPanel';
import { WaterLevelsPanel } from '../data-layers/WaterLevelsPanel';
import { TrafficPanel } from '../data-layers/TrafficPanel';
import { ReportsPanel } from '../data-layers/ReportsPanel';
import { ParkingPanel } from '../data-layers/ParkingPanel';
import { MeetingCalendar } from '../civic/MeetingCalendar';
import { RepresentativesPanel } from '../civic/RepresentativeCard';
import { RewardsPanel } from '../rewards/RewardsPanel';
import { MunicipalityProfile } from '../municipalities/MunicipalityProfile';
import { MunicipalityCompare } from '../municipalities/MunicipalityCompare';
import { AddressIntelligencePanel } from '../shared/AddressIntelligencePanel';
import { CountyDashboard } from '../data-layers/CountyDashboard';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { LayerHealthBanner } from '../layers/LayerHealthBanner';
import { PlacesPanel } from '../discover/PlacesPanel';
import { EventsPanel } from '../discover/EventsPanel';
import { productFeatures } from '../../config/features';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function AppShell() {
  const { state, dispatch } = useAppState();
  const rewardsEnabled = productFeatures.experimentalExploration;
  const { rewards, visitMunicipality, earnBadge } = useRewards(rewardsEnabled);
  const isMobile = useIsMobile();
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('fr-welcomed'));
  const [showTour, setShowTour] = useState(false);
  const [bottomSheetSnap, setBottomSheetSnap] = useState<SnapPoint>('peek');
  const [radiusCenter, setRadiusCenter] = useState<[number, number] | null>(null);

  const handleOpenPanel = (content: 'weather' | 'water' | 'civic' | 'rewards' | 'traffic' | 'reports' | 'parking' | 'compare' | 'dashboard' | 'places' | 'events') => {
    dispatch({ type: 'OPEN_PANEL', content });
    if (isMobile) setBottomSheetSnap('full');
    if (productFeatures.experimentalExploration) {
      if (content === 'weather') earnBadge('weather-watcher');
      if (content === 'water') earnBadge('water-monitor');
      if (content === 'civic') earnBadge('civic-minded');
    }
  };

  useEffect(() => {
    if (!rewardsEnabled || !state.selectedMunicipality) return;
    visitMunicipality(state.selectedMunicipality);
  }, [rewardsEnabled, state.selectedMunicipality, visitMunicipality]);

  // Enter key skips welcome
  useEffect(() => {
    if (!showWelcome) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { setShowWelcome(false); sessionStorage.setItem('fr-welcomed', '1'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWelcome]);

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => { setShowWelcome(false); sessionStorage.setItem('fr-welcomed', '1'); }} />;
  }

  const mobileSheetSnap: SnapPoint = state.slidePanelContent || state.selectedMunicipality
    ? 'full'
    : bottomSheetSnap;

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <div className="h-full w-full relative">
        <CommandPalette />

        {/* Full-screen Map */}
        <div className="h-full w-full">
          <MapView radiusCenter={radiusCenter} onCloseRadius={() => setRadiusCenter(null)} />
          <LayerHealthBanner />
          {showTour && <GuidedTour onClose={() => setShowTour(false)} />}
        </div>

        {/* Bottom Sheet */}
        <BottomSheet
          snap={mobileSheetSnap}
          onSnapChange={setBottomSheetSnap}
          peekContent={<SearchBar />}
        >
          {state.slidePanelContent ? (
            <div>
              <button
                onClick={() => { dispatch({ type: 'CLOSE_PANEL' }); setBottomSheetSnap('half'); }}
                className="flex items-center gap-1.5 text-[14px] font-medium text-accent mb-3 py-1 active:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <ErrorBoundary>
                <MobilePanelContent type={state.slidePanelContent} rewards={rewards} addressIntel={state.addressIntel} />
              </ErrorBoundary>
            </div>
          ) : (
            <HomeFeed
              onOpenPanel={(content) => handleOpenPanel(content as Parameters<typeof handleOpenPanel>[0])}
              onSelectMunicipality={(id) => dispatch({ type: 'SELECT_MUNICIPALITY', id })}
              selectedMunicipality={state.selectedMunicipality}
            />
          )}
        </BottomSheet>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <div className="flex h-full">
      <CommandPalette />

      {/* Mobile sidebar toggle (hidden on desktop, but kept for tablet) */}
      {!state.sidebarOpen && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="fixed left-3 top-3 z-50 glass rounded-lg p-2.5 shadow-lg hover:bg-bg-hover transition-colors"
        >
          <svg className="h-5 w-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      {state.sidebarOpen && (
        <Sidebar
          onOpenPanel={handleOpenPanel}
          onStartTour={() => setShowTour(true)}
        />
      )}

      {/* Map */}
      <div className="relative flex-1 min-w-0">
        <MapView radiusCenter={radiusCenter} onCloseRadius={() => setRadiusCenter(null)} />
        <LayerHealthBanner />
        <CountyPulse />
        <LiveActivityFeed />
        {showTour && <GuidedTour onClose={() => setShowTour(false)} />}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-[10px] text-text-muted">
            <kbd className="rounded bg-bg-surface border border-border px-1 py-0.5 text-[9px]">⌘K</kbd>
            <span>Search</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LAYER_PANEL' })}
            className={`glass rounded-full px-3 py-1.5 text-[10px] transition-colors ${
              state.layerPanelOpen ? 'text-accent' : 'text-text-muted hover:text-text'
            }`}
          >
            ◆ Layers
          </button>
          <button
            onClick={() => setShowTour(true)}
            className="glass rounded-full px-3 py-1.5 text-[10px] text-text-muted hover:text-text transition-colors"
          >
            🧭 Tour
          </button>
        </div>
      </div>

      {/* Layer Panel (desktop only) */}
      <AnimatePresence>
        {state.layerPanelOpen && !state.slidePanelOpen && (
          <LayerPanel />
        )}
      </AnimatePresence>

      {/* Slide Panel (desktop only) */}
      <AnimatePresence>
        {state.slidePanelOpen && (
          <SlidePanel rewards={rewards} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobilePanelContent({ type, rewards, addressIntel }: {
  type: string; rewards: import('../../types').RewardsState;
  addressIntel?: { lat: number; lng: number; address: string };
}) {
  switch (type) {
    case 'municipality': return <MunicipalityProfile />;
    case 'weather': return <WeatherPanel />;
    case 'water': return <WaterLevelsPanel />;
    case 'traffic': return <TrafficPanel />;
    case 'reports': return <ReportsPanel />;
    case 'parking': return <ParkingPanel />;
    case 'compare': return <MunicipalityCompare />;
    case 'dashboard': return <CountyDashboard />;
    case 'places': return <PlacesPanel />;
    case 'events': return <EventsPanel />;
    case 'rewards': return productFeatures.experimentalExploration
      ? <RewardsPanel rewards={rewards} />
      : <ExperimentalFeatureNotice />;
    case 'civic': return (
      <div className="space-y-6">
        <div><h3 className="mb-3 text-sm font-semibold text-text">Upcoming Meetings</h3><MeetingCalendar /></div>
        <div><h3 className="mb-3 text-sm font-semibold text-text">Representatives</h3><RepresentativesPanel /></div>
      </div>
    );
    case 'address-intel': return addressIntel ? (
      <AddressIntelligencePanel lat={addressIntel.lat} lng={addressIntel.lng} address={addressIntel.address} />
    ) : <div className="text-sm text-text-secondary">Search for an address to inspect location context and source-backed overlays.</div>;
    default: return null;
  }
}

function ExperimentalFeatureNotice() {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-4 text-sm text-text-secondary">
      Exploration rewards are disabled in the trust-first build. If they return, they should stay clearly experimental and never outrank civic utility.
    </div>
  );
}
