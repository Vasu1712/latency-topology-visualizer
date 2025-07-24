import { Exchange, CloudRegion } from '@/lib/types';

export const mockExchanges: Exchange[] = [
  {
    id: 'binance-us-east',
    name: 'Binance',
    city: 'New York',
    position: [40.7128, -74.0060, 0], // New York
    cloudProvider: 'aws',
    region: 'us-east-1',
    status: 'online',
  },
  {
    id: 'coinbase-us-west',
    name: 'Coinbase',
    city: 'San Francisco',
    position: [37.7749, -122.4194, 0], // San Francisco
    cloudProvider: 'gcp',
    region: 'us-west1',
    status: 'online',
  },
  {
    id: 'okx-singapore',
    name: 'OKX',
    city: 'Singapore',
    position: [1.3521, 103.8198, 0], // Singapore
    cloudProvider: 'azure',
    region: 'southeastasia',
    status: 'online',
  },
  {
    id: 'deribit-europe',
    name: 'Deribit',
    city: 'Amsterdam',
    position: [52.3676, 4.9041, 0], // Amsterdam
    cloudProvider: 'aws',
    region: 'eu-west-1',
    status: 'online',
  },
  {
    id: 'bybit-tokyo',
    name: 'Bybit',
    city: 'Tokyo',
    position: [35.6762, 139.6503, 0], // Tokyo
    cloudProvider: 'gcp',
    region: 'asia-northeast1',
    status: 'online',
  },
];

export const mockCloudRegions: CloudRegion[] = [
  {
    id: 'aws-us-east-1',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    provider: 'aws',
    position: [38.9072, -77.0369, 0],
    serverCount: 150,
  },
  {
    id: 'gcp-us-west1',
    name: 'US West (Oregon)',
    code: 'us-west1',
    provider: 'gcp',
    position: [45.5152, -122.6784, 0],
    serverCount: 120,
  },
  {
    id: 'azure-southeastasia',
    name: 'Southeast Asia',
    code: 'southeastasia',
    provider: 'azure',
    position: [1.3521, 103.8198, 0],
    serverCount: 80,
  },
  {
    id: 'aws-eu-west-1',
    name: 'Europe (Ireland)',
    code: 'eu-west-1',
    provider: 'aws',
    position: [53.3498, -6.2603, 0],
    serverCount: 200,
  },
];
