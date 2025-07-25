/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Exchange, CloudRegion } from '@/lib/types';

const API_BASE_URL = 'https://api.cloudflare.com/client/v4/radar';

const getFetchOptions = () => ({
  headers: {
    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  cache: 'no-store' as RequestCache,
});

export async function GET() {
  try {
    const perfResponse = await fetch(`${API_BASE_URL}/quality/speed/top/locations?metric=latency&limit=20&format=json`, getFetchOptions());
    if (!perfResponse.ok) {
      throw new Error(`Performance API error: ${perfResponse.statusText}`);
    }
    const perfData = await perfResponse.json();
    
    if (!perfData.success || !Array.isArray(perfData.result?.top_0)) {
      throw new Error('Invalid performance data format');
    }
    const perfLocations = perfData.result.top_0;

    const knownLocations: Record<string, { lat: number; lon: number; name: string }> = {
      'US': { lat: 39.8283, lon: -98.5795, name: 'United States' },
      'GB': { lat: 55.3781, lon: -3.4360, name: 'United Kingdom' },
      'DE': { lat: 51.1657, lon: 10.4515, name: 'Germany' },
      'FR': { lat: 46.6034, lon: 1.8883, name: 'France' },
      'JP': { lat: 36.2048, lon: 138.2529, name: 'Japan' },
      'CN': { lat: 35.8617, lon: 104.1954, name: 'China' },
      'IN': { lat: 20.5937, lon: 78.9629, name: 'India' },
      'BR': { lat: -14.2350, lon: -51.9253, name: 'Brazil' },
      'AU': { lat: -25.2744, lon: 133.7751, name: 'Australia' },
      'CA': { lat: 56.1304, lon: -106.3468, name: 'Canada' },
      'RU': { lat: 61.5240, lon: 105.3188, name: 'Russia' },
      'KR': { lat: 35.9078, lon: 127.7669, name: 'South Korea' },
      'SG': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
      'ES': { lat: 40.4637, lon: -3.7492, name: 'Spain' },
      'IT': { lat: 41.8719, lon: 12.5674, name: 'Italy' },
      'NL': { lat: 52.1326, lon: 5.2913, name: 'Netherlands' },
      'SE': { lat: 60.1282, lon: 18.6435, name: 'Sweden' },
      'NO': { lat: 60.4720, lon: 8.4689, name: 'Norway' },
      'CH': { lat: 46.8182, lon: 8.2275, name: 'Switzerland' },
      'BE': { lat: 50.5039, lon: 4.4699, name: 'Belgium' },
      'AT': { lat: 47.5162, lon: 14.5501, name: 'Austria' },
      'PT': { lat: 39.3999, lon: -8.2245, name: 'Portugal' },
      'IE': { lat: 53.4129, lon: -8.2439, name: 'Ireland' },
      'DK': { lat: 56.2639, lon: 9.5018, name: 'Denmark' },
      'FI': { lat: 61.9241, lon: 25.7482, name: 'Finland' },
      'PL': { lat: 51.9194, lon: 19.1451, name: 'Poland' },
      'CZ': { lat: 49.8175, lon: 15.4730, name: 'Czech Republic' },
      'HU': { lat: 47.1625, lon: 19.5033, name: 'Hungary' },
      'RO': { lat: 45.9432, lon: 24.9668, name: 'Romania' },
      'GR': { lat: 39.0742, lon: 21.8243, name: 'Greece' },
      'TR': { lat: 38.9637, lon: 35.2433, name: 'Turkey' },
      'ZA': { lat: -30.5595, lon: 22.9375, name: 'South Africa' },
      'EG': { lat: 26.0975, lon: 31.4867, name: 'Egypt' },
      'MX': { lat: 23.6345, lon: -102.5528, name: 'Mexico' },
      'AR': { lat: -38.4161, lon: -63.6167, name: 'Argentina' },
      'CL': { lat: -35.6751, lon: -71.5430, name: 'Chile' },
      'CO': { lat: 4.5709, lon: -74.2973, name: 'Colombia' },
      'TH': { lat: 15.8700, lon: 100.9925, name: 'Thailand' },
      'MY': { lat: 4.2105, lon: 101.9758, name: 'Malaysia' },
      'ID': { lat: -0.7893, lon: 113.9213, name: 'Indonesia' },
      'PH': { lat: 12.8797, lon: 121.7740, name: 'Philippines' },
      'VN': { lat: 14.0583, lon: 108.2772, name: 'Vietnam' },
      'IL': { lat: 31.0461, lon: 34.8516, name: 'Israel' },
      'SA': { lat: 23.8859, lon: 45.0792, name: 'Saudi Arabia' },
      'AE': { lat: 23.4241, lon: 53.8478, name: 'United Arab Emirates' },
      'NZ': { lat: -40.9006, lon: 174.8860, name: 'New Zealand' },
      'VI': { lat: 18.3358, lon: -64.8963, name: 'Virgin Islands' },
      'MT': { lat: 35.9375, lon: 14.3754, name: 'Malta' },
      'RE': { lat: -21.1151, lon: 55.5364, name: 'Reunion' },
      'PR': { lat: 18.2208, lon: -66.5901, name: 'Puerto Rico' },
      'MD': { lat: 47.4116, lon: 28.3699, name: 'Moldova' },
      'KY': { lat: 19.3133, lon: -81.2546, name: 'Cayman Islands' },
      'JO': { lat: 30.5852, lon: 36.2384, name: 'Jordan' },
      'CR': { lat: 9.7489, lon: -83.7534, name: 'Costa Rica' },
      'PA': { lat: 8.5380, lon: -80.7821, name: 'Panama' },
      'UY': { lat: -32.5228, lon: -55.7658, name: 'Uruguay' }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validLocations = perfLocations.filter((loc: any) => {
      return knownLocations[loc.clientCountryAlpha2];
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exchanges: Exchange[] = validLocations.map((loc: any, index: number) => {
      const locationData = knownLocations[loc.clientCountryAlpha2];
      return {
        id: `cf-${loc.clientCountryAlpha2}-${index}`,
        name: loc.clientCountryName,
        city: loc.clientCountryName,
        cloudProvider: ['aws', 'gcp', 'azure'][index % 3] as 'aws' | 'gcp' | 'azure',
        position: [locationData.lat, locationData.lon, 0],
        region: loc.clientCountryAlpha2,
        status: 'online',
        latency: parseFloat(loc.latencyIdle) || Math.random() * 200 + 10,
      };
    });

    const cloudRegions: CloudRegion[] = validLocations.map((loc: any, index: number) => {
      const locationData = knownLocations[loc.clientCountryAlpha2];
      return {
        id: `cf-region-${loc.clientCountryAlpha2}-${index}`,
        name: loc.clientCountryName,
        code: loc.clientCountryAlpha2,
        provider: ['aws', 'gcp', 'azure'][index % 3] as 'aws' | 'gcp' | 'azure',
        position: [locationData.lat, locationData.lon, 0],
        serverCount: Math.floor(Math.random() * 200) + 50,
      };
    });

    return NextResponse.json({
      exchanges,
      cloudRegions,
      timestamp: Date.now(),
      success: true
    });

  } catch (error) {
    console.error('Error in /api/latency route:', error);
    return NextResponse.json({
      error: (error as Error).message, 
      exchanges: [], 
      cloudRegions: [],
      timestamp: Date.now(),
      success: false
    }, { status: 500 });
  }
}
