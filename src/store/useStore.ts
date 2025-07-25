import { create } from 'zustand';
import { AppState, Exchange, CloudRegion, LatencyData } from '@/lib/types';
import { CLOUD_PROVIDERS } from '@/lib/constants';

interface VisibilityControls {
  showExchanges: boolean;
  showConnections: boolean;
  showRegions: boolean;
}

interface HistoricalDataPoint {
  timestamp: number;
  latency: number;
  exchangeId: string;
  exchangeName: string;
}

interface FilterState {
  searchQuery: string;
  selectedClouds: string[];
  latencyRange: [number, number];
  timeRange: string;
  selectedExchanges: Exchange[];
}

interface AppStateWithFlow extends AppState {
  isStarted: boolean;
  hoveredCity: string | null;
  lastDataUpdate: Date | null;
  isDataLoading: boolean;
  visibility: VisibilityControls;
  filterState: FilterState;
  historicalLatencyData: HistoricalDataPoint[];
  isChartDataLoading: boolean;
}

interface StoreActions {
  updateLatencyData: (data: LatencyData[]) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  setSelectedPair: (pair: string | null) => void;
  toggleRealTime: () => void;
  toggleTheme: () => void;
  setExchanges: (exchanges: Exchange[]) => void;
  setCloudRegions: (regions: CloudRegion[]) => void;
  setStarted: (started: boolean) => void;
  setHoveredCity: (city: string | null) => void;
  setLastDataUpdate: (date: Date) => void;
  setDataLoading: (loading: boolean) => void;
  // Visibility controls
  toggleExchanges: () => void;
  toggleConnections: () => void;
  toggleRegions: () => void;
  setVisibility: (visibility: Partial<VisibilityControls>) => void;
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedClouds: (clouds: string[]) => void;
  setLatencyRange: (range: [number, number]) => void;
  setTimeRange: (range: string) => void;
  // Multi-exchange selection actions
  setSelectedExchanges: (exchanges: Exchange[]) => void;
  addSelectedExchange: (exchange: Exchange) => void;
  removeSelectedExchange: (exchangeId: string) => void;
  clearSelectedExchanges: () => void;
  updateHistoricalData: (data: HistoricalDataPoint[]) => void;
  setChartDataLoading: (loading: boolean) => void;
  // Validation helpers
  areChartParametersReady: () => boolean;
  getChartParameters: () => {
    exchanges: Exchange[];
    cloudProviders: string[];
    maxLatency: number;
    timeRange: string;
  } | null;
  // Computed getters
  getAverageLatency: () => number;
  getTotalConnections: () => number;
  getLatencyStats: () => { low: number; medium: number; high: number };
}

export const useStore = create<AppStateWithFlow & StoreActions>((set, get) => ({
  // Initial State
  exchanges: [],
  cloudRegions: [],
  latencyData: [],
  historicalData: {},
  historicalLatencyData: [],
  filters: {
    providers: Object.keys(CLOUD_PROVIDERS),
    exchanges: [],
    latencyRange: [0, 1000],
  },
  selectedPair: null,
  isRealTime: true,
  theme: 'dark',
  isStarted: false,
  hoveredCity: null,
  lastDataUpdate: null,
  isDataLoading: false,
  isChartDataLoading: false,
  visibility: {
    showExchanges: true,
    showConnections: true,
    showRegions: true,
  },
  filterState: {
    searchQuery: '',
    selectedClouds: ['aws', 'gcp', 'azure'],
    latencyRange: [0, 500],
    timeRange: '',
    selectedExchanges: [],
  },

  updateLatencyData: (data) => set({ latencyData: data }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedPair: (pair) => set({ selectedPair: pair }),
  toggleRealTime: () => set((state) => ({ isRealTime: !state.isRealTime })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setExchanges: (exchanges) => set({ exchanges, lastDataUpdate: new Date() }),
  setCloudRegions: (regions) => set({ cloudRegions: regions }),
  setStarted: (started) => set({ isStarted: started }),
  setHoveredCity: (city) => set({ hoveredCity: city }),
  setLastDataUpdate: (date) => set({ lastDataUpdate: date }),
  setDataLoading: (loading) => set({ isDataLoading: loading }),
  setChartDataLoading: (loading) => set({ isChartDataLoading: loading }),

  // Visibility controls
  toggleExchanges: () =>
    set((state) => ({
      visibility: { ...state.visibility, showExchanges: !state.visibility.showExchanges }
    })),
  toggleConnections: () =>
    set((state) => ({
      visibility: { ...state.visibility, showConnections: !state.visibility.showConnections }
    })),
  toggleRegions: () =>
    set((state) => ({
      visibility: { ...state.visibility, showRegions: !state.visibility.showRegions }
    })),
  setVisibility: (visibility) =>
    set((state) => ({
      visibility: { ...state.visibility, ...visibility }
    })),

  // filter actions
  setSearchQuery: (query) =>
    set((state) => ({
      filterState: { ...state.filterState, searchQuery: query }
    })),
  setSelectedClouds: (clouds) =>
    set((state) => ({
      filterState: { ...state.filterState, selectedClouds: clouds }
    })),
  setLatencyRange: (range) =>
    set((state) => ({
      filterState: { ...state.filterState, latencyRange: range }
    })),
  setTimeRange: (range) => {
    set((state) => ({
      filterState: { ...state.filterState, timeRange: range }
    }));
    
    // chart
    const state = get();
    if (range && state.areChartParametersReady()) {
      // Clear existing data and start loading
      set({ historicalLatencyData: [], isChartDataLoading: true });
    }
  },

  setSelectedExchanges: (exchanges) =>
    set((state) => ({
      filterState: { ...state.filterState, selectedExchanges: exchanges }
    })),
  addSelectedExchange: (exchange) =>
    set((state) => {
      const current = state.filterState.selectedExchanges;
      if (current.length >= 2) {
        return {
          filterState: {
            ...state.filterState,
            selectedExchanges: [current[1], exchange]
          }
        };
      }
      if (!current.find(e => e.id === exchange.id)) {
        return {
          filterState: {
            ...state.filterState,
            selectedExchanges: [...current, exchange]
          }
        };
      }
      return state;
    }),
  removeSelectedExchange: (exchangeId) =>
    set((state) => ({
      filterState: {
        ...state.filterState,
        selectedExchanges: state.filterState.selectedExchanges.filter(e => e.id !== exchangeId)
      }
    })),
  clearSelectedExchanges: () =>
    set((state) => ({
      filterState: { ...state.filterState, selectedExchanges: [] }
    })),
  updateHistoricalData: (data) => set({ 
    historicalLatencyData: data, 
    isChartDataLoading: false 
  }),

  areChartParametersReady: () => {
    const state = get();
    return (
      state.filterState.selectedExchanges.length > 0 &&
      state.filterState.selectedClouds.length > 0 &&
      state.filterState.latencyRange[1] > 0 &&
      state.filterState.timeRange.trim() !== ''
    );
  },

  getChartParameters: () => {
    const state = get();
    if (!state.areChartParametersReady()) return null;
    
    return {
      exchanges: state.filterState.selectedExchanges,
      cloudProviders: state.filterState.selectedClouds,
      maxLatency: state.filterState.latencyRange[1],
      timeRange: state.filterState.timeRange,
    };
  },

  getAverageLatency: () => {
    const latencyData = get().latencyData;
    if (latencyData.length === 0) return 0;
    const total = latencyData.reduce((sum, data) => sum + data.latency, 0);
    return Math.round(total / latencyData.length * 10) / 10;
  },

  getTotalConnections: () => {
    return get().latencyData.length;
  },

  getLatencyStats: () => {
    const latencyData = get().latencyData;
    return {
      low: latencyData.filter(l => l.latency < 50).length,
      medium: latencyData.filter(l => l.latency >= 50 && l.latency <= 150).length,
      high: latencyData.filter(l => l.latency > 150).length,
    };
  },
}));
