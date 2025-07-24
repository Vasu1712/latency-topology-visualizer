import { Exchange } from '@/lib/types';

export const exchangesData: Exchange[] = [
  {
    id: 'binance-us-east-1',
    name: 'Binance',
    city: 'New York',
    position: [40.7128, -74.0060, 0], // New York
    cloudProvider: 'aws',
    region: 'us-east-1',
    status: 'online',
  },
  {
    id: 'binance-eu-west-1',
    name: 'Binance EU',
    city: 'Dublin',
    position: [53.3498, -6.2603, 0], // Dublin
    cloudProvider: 'aws',
    region: 'eu-west-1',
    status: 'online',
  },
  {
    id: 'coinbase-us-west-1',
    name: 'Coinbase Pro',
    city: 'San Francisco',
    position: [37.7749, -122.4194, 0], // San Francisco
    cloudProvider: 'gcp',
    region: 'us-west1',
    status: 'online',
  },
  {
    id: 'coinbase-europe-west1',
    name: 'Coinbase EU',
    city: 'Frankfurt',
    position: [50.1109, 8.6821, 0], // Frankfurt
    cloudProvider: 'gcp',
    region: 'europe-west1',
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
    id: 'okx-hong-kong',
    name: 'OKX HK',
    city: 'Hong Kong',
    position: [22.3193, 114.1694, 0], // Hong Kong
    cloudProvider: 'azure',
    region: 'eastasia',
    status: 'online',
  },
  {
    id: 'deribit-europe-west',
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
  {
    id: 'bybit-singapore',
    name: 'Bybit SG',
    city: 'Singapore',
    position: [1.3521, 103.8198, 0], // Singapore
    cloudProvider: 'aws',
    region: 'ap-southeast-1',
    status: 'online',
  },
  {
    id: 'kraken-us-west',
    name: 'Kraken',
    city: 'San Francisco',
    position: [37.7749, -122.4194, 0], // San Francisco
    cloudProvider: 'gcp',
    region: 'us-west1',
    status: 'online',
  },
  {
    id: 'kraken-europe',
    name: 'Kraken EU',
    city: 'London',
    position: [51.5074, -0.1278, 0], // London
    cloudProvider: 'aws',
    region: 'eu-west-2',
    status: 'maintenance',
  },
  {
    id: 'kucoin-singapore',
    name: 'KuCoin',
    city: 'Singapore',
    position: [1.3521, 103.8198, 0], // Singapore
    cloudProvider: 'azure',
    region: 'southeastasia',
    status: 'online',
  },
  {
    id: 'huobi-tokyo',
    name: 'Huobi',
    city: 'Tokyo',
    position: [35.6762, 139.6503, 0], // Tokyo
    cloudProvider: 'aws',
    region: 'ap-northeast-1',
    status: 'online',
  },
  {
    id: 'gate-io-seoul',
    name: 'Gate.io',
    city: 'Seoul',
    position: [37.5665, 126.9780, 0], // Seoul
    cloudProvider: 'azure',
    region: 'koreacentral',
    status: 'online',
  },
  {
    id: 'bitfinex-us-east',
    name: 'Bitfinex',
    city: 'New York',
    position: [40.7128, -74.0060, 0], // New York
    cloudProvider: 'aws',
    region: 'us-east-1',
    status: 'online',
  },
];
