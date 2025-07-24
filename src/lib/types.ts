export interface CloudProvider {
  id: string;
  name: 'AWS' | 'GCP' | 'Azure';
  color: string;
}

export interface Exchange {
  id: string;
  name: string;
  city: string;
  position: [number, number, number]; // [lat, lng, altitude]
  cloudProvider: CloudProvider['id'];
  region: string;
  status: 'online' | 'offline' | 'maintenance';
}

export interface CloudRegion {
  id: string;
  name: string;
  code: string;
  provider: CloudProvider['id'];
  position: [number, number, number];
  serverCount: number;
}

export interface LatencyData {
  id: string;
  source: string;
  target: string;
  latency: number;
  timestamp: number;
  status: 'low' | 'medium' | 'high';
}

export interface HistoricalLatency {
  timestamp: number;
  latency: number;
  min: number;
  max: number;
  avg: number;
}

export interface AppState {
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
  historicalData: Record<string, HistoricalLatency[]>;
  filters: {
    providers: string[];
    exchanges: string[];
    latencyRange: [number, number];
  };
  selectedPair: string | null;
  isRealTime: boolean;
  theme: 'light' | 'dark';
}
