import { CloudProvider } from "./types";

export const CLOUD_PROVIDERS: Record<string, CloudProvider> = {
  aws: { id: 'aws', name: 'AWS', color: '#ff9900' },
  gcp: { id: 'gcp', name: 'GCP', color: '#34a853' },
  azure: { id: 'azure', name: 'Azure', color: '#3ccbf4' },
};

export const LATENCY_THRESHOLDS = {
  low: 50,
  medium: 150,
  high: 300,
};

export const UPDATE_INTERVAL = 5000; // 5 seconds
export const CHART_TIME_RANGES = {
  '1h': 3600000,
  '24h': 86400000,
  '7d': 604800000,
  '30d': 2592000000,
};