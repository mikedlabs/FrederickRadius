import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, MapLayer } from '../types';
import { mapLayers } from '../data/layers';

interface AppContextType {
  state: AppState;
  layers: MapLayer[];
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SELECT_MUNICIPALITY'; id: string | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_PANEL'; content: AppState['slidePanelContent'] }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_LAYER'; layerId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'ADDRESS_INTEL'; lat: number; lng: number; address: string }
  | { type: 'SET_LAYER_OPACITY'; layerId: string; opacity: number }
  | { type: 'SET_LAYER_ORDER'; order: string[] }
  | { type: 'DISCOVER'; layerIds: string[]; opacities: Record<string, number>; summary: string }
  | { type: 'CLEAR_LAYERS' }
  | { type: 'TOGGLE_LAYER_PANEL' };

const initialState: AppState = {
  selectedMunicipality: null,
  activeLayers: [],
  sidebarOpen: true,
  slidePanelOpen: false,
  slidePanelContent: null,
  searchQuery: '',
  layerOpacity: {},
  layerOrder: [],
  discoverSummary: null,
  layerPanelOpen: false,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_MUNICIPALITY':
      return {
        ...state,
        selectedMunicipality: action.id,
        slidePanelOpen: action.id !== null,
        slidePanelContent: action.id !== null ? 'municipality' : null,
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'OPEN_PANEL':
      return { ...state, slidePanelOpen: true, slidePanelContent: action.content };
    case 'CLOSE_PANEL':
      return { ...state, slidePanelOpen: false, slidePanelContent: null, selectedMunicipality: null };
    case 'TOGGLE_LAYER': {
      const isActive = state.activeLayers.includes(action.layerId);
      const active = isActive
        ? state.activeLayers.filter((id) => id !== action.layerId)
        : [...state.activeLayers, action.layerId];
      const order = isActive
        ? state.layerOrder.filter((id) => id !== action.layerId)
        : [action.layerId, ...state.layerOrder];
      return { ...state, activeLayers: active, layerOrder: order, discoverSummary: null };
    }
    case 'SET_LAYER_OPACITY':
      return { ...state, layerOpacity: { ...state.layerOpacity, [action.layerId]: action.opacity } };
    case 'SET_LAYER_ORDER':
      return { ...state, layerOrder: action.order };
    case 'DISCOVER':
      return {
        ...state,
        activeLayers: action.layerIds,
        layerOrder: action.layerIds,
        layerOpacity: action.opacities,
        discoverSummary: action.summary,
      };
    case 'CLEAR_LAYERS':
      return { ...state, activeLayers: [], layerOrder: [], layerOpacity: {}, discoverSummary: null };
    case 'TOGGLE_LAYER_PANEL':
      return { ...state, layerPanelOpen: !state.layerPanelOpen };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'ADDRESS_INTEL':
      return {
        ...state,
        slidePanelOpen: true,
        slidePanelContent: 'address-intel',
        addressIntel: { lat: action.lat, lng: action.lng, address: action.address },
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const layers = mapLayers.map((l) => ({
    ...l,
    visible: state.activeLayers.includes(l.id),
  }));

  return (
    <AppContext value={{ state, layers, dispatch }}>
      {children}
    </AppContext>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
