import { CloudRegion } from '@/lib/types';

export const cloudRegionsData: CloudRegion[] = [
  // AWS Regions
  {
    id: 'aws-us-east-1',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    provider: 'aws',
    position: [38.9072, -77.0369, 0], // Virginia
    serverCount: 150,
  },
  {
    id: 'aws-us-west-2',
    name: 'US West (Oregon)',
    code: 'us-west-2',
    provider: 'aws',
    position: [45.5152, -122.6784, 0], // Oregon
    serverCount: 120,
  },
  {
    id: 'aws-eu-west-1',
    name: 'Europe (Ireland)',
    code: 'eu-west-1',
    provider: 'aws',
    position: [53.3498, -6.2603, 0], // Dublin
    serverCount: 200,
  },
  {
    id: 'aws-eu-west-2',
    name: 'Europe (London)',
    code: 'eu-west-2',
    provider: 'aws',
    position: [51.5074, -0.1278, 0], // London
    serverCount: 180,
  },
  {
    id: 'aws-ap-southeast-1',
    name: 'Asia Pacific (Singapore)',
    code: 'ap-southeast-1',
    provider: 'aws',
    position: [1.3521, 103.8198, 0], // Singapore
    serverCount: 140,
  },
  {
    id: 'aws-ap-northeast-1',
    name: 'Asia Pacific (Tokyo)',
    code: 'ap-northeast-1',
    provider: 'aws',
    position: [35.6762, 139.6503, 0], // Tokyo
    serverCount: 160,
  },

  // Google Cloud Regions
  {
    id: 'gcp-us-west1',
    name: 'US West (Oregon)',
    code: 'us-west1',
    provider: 'gcp',
    position: [45.5152, -122.6784, 0], // Oregon
    serverCount: 100,
  },
  {
    id: 'gcp-us-central1',
    name: 'US Central (Iowa)',
    code: 'us-central1',
    provider: 'gcp',
    position: [41.8781, -93.0977, 0], // Iowa
    serverCount: 130,
  },
  {
    id: 'gcp-europe-west1',
    name: 'Europe West (Belgium)',
    code: 'europe-west1',
    provider: 'gcp',
    position: [50.8503, 4.3517, 0], // Brussels
    serverCount: 110,
  },
  {
    id: 'gcp-asia-northeast1',
    name: 'Asia Northeast (Tokyo)',
    code: 'asia-northeast1',
    provider: 'gcp',
    position: [35.6762, 139.6503, 0], // Tokyo
    serverCount: 90,
  },
  {
    id: 'gcp-asia-southeast1',
    name: 'Asia Southeast (Singapore)',
    code: 'asia-southeast1',
    provider: 'gcp',
    position: [1.3521, 103.8198, 0], // Singapore
    serverCount: 85,
  },

  // Azure Regions
  {
    id: 'azure-eastus',
    name: 'East US',
    code: 'eastus',
    provider: 'azure',
    position: [38.9072, -77.0369, 0], // Virginia
    serverCount: 125,
  },
  {
    id: 'azure-westus2',
    name: 'West US 2',
    code: 'westus2',
    provider: 'azure',
    position: [47.6062, -122.3321, 0], // Seattle
    serverCount: 115,
  },
  {
    id: 'azure-northeurope',
    name: 'North Europe',
    code: 'northeurope',
    provider: 'azure',
    position: [53.3498, -6.2603, 0], // Dublin
    serverCount: 95,
  },
  {
    id: 'azure-westeurope',
    name: 'West Europe',
    code: 'westeurope',
    provider: 'azure',
    position: [52.3667, 4.9000, 0], // Netherlands
    serverCount: 105,
  },
  {
    id: 'azure-southeastasia',
    name: 'Southeast Asia',
    code: 'southeastasia',
    provider: 'azure',
    position: [1.3521, 103.8198, 0], // Singapore
    serverCount: 80,
  },
  {
    id: 'azure-eastasia',
    name: 'East Asia',
    code: 'eastasia',
    provider: 'azure',
    position: [22.3193, 114.1694, 0], // Hong Kong
    serverCount: 75,
  },
  {
    id: 'azure-koreacentral',
    name: 'Korea Central',
    code: 'koreacentral',
    provider: 'azure',
    position: [37.5665, 126.9780, 0], // Seoul
    serverCount: 70,
  },
];
