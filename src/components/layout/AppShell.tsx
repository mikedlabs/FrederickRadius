import { useAppState } from '../../hooks/useAppState';
import { useRewards } from '../../hooks/useRewards';
import { MapView } from '../map/MapView';
import { Sidebar } from './Sidebar';
import { SlidePanel } from './SlidePanel';

export function AppShell() {
  const { state, dispatch } = useAppState();
  const { rewards, visitMunicipality, earnBadge } = useRewards();

  // Track municipality visits for rewards
  const handleOpenPanel = (content: 'weather' | 'water' | 'civic' | 'rewards') => {
    dispatch({ type: 'OPEN_PANEL', content });

    // Earn badges based on actions
    if (content === 'weather') earnBadge('weather-watcher');
    if (content === 'water') earnBadge('water-monitor');
    if (content === 'civic') earnBadge('civic-minded');
  };

  // Track municipality selections for rewards
  if (state.selectedMunicipality) {
    visitMunicipality(state.selectedMunicipality);
  }

  return (
    <div className="flex h-full">
      {/* Sidebar Toggle for mobile */}
      {!state.sidebarOpen && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="fixed left-3 top-3 z-50 rounded-lg bg-bg-elevated border border-border p-2 shadow-lg hover:bg-bg-hover transition-colors lg:hidden"
        >
          <svg className="h-5 w-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <Sidebar onOpenPanel={handleOpenPanel} points={rewards.points} />

      {/* Map */}
      <div className="relative flex-1">
        <MapView />

        {/* Sidebar toggle overlay for desktop when collapsed */}
        {!state.sidebarOpen && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="absolute left-3 top-3 z-10 hidden rounded-lg bg-bg-elevated border border-border p-2 shadow-lg hover:bg-bg-hover transition-colors lg:block"
          >
            <svg className="h-5 w-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Slide Panel */}
      <SlidePanel rewards={rewards} />
    </div>
  );
}
