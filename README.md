# Latency Topology Visualizer

A real-time 3D globe visualization platform for monitoring cryptocurrency exchange latency and network performance across global cloud providers. Built with Next.js, Three.js, and Zustand for enterprise-grade performance monitoring.

## Features

### Core Functionality

* **3D Interactive Globe**: Real-time visualization of global cryptocurrency exchanges
* **Multi-Exchange Comparison**: Compare latency between up to 2 exchanges simultaneously
* **Historical Time-Series Analysis**: View latency trends over configurable time periods
* **Real-Time Data Updates**: Live latency monitoring with 10-second refresh intervals
* **Advanced Filtering**: Search, cloud provider selection, and latency range filtering

### Visualization Components

* **Exchange Markers**: Color-coded markers for AWS, GCP, and Azure deployments
* **Cloud Region Indicators**: Dual-dot markers showing cloud provider regions
* **Latency Connections**: Dynamic lines showing connection quality (green/yellow/red)
* **Interactive Legend**: Comprehensive legend with visibility controls
* **Theme Support**: Dark/light mode with glassmorphism UI design

## Data Sources

* **Cloudflare Radar API**: Real-time global internet performance metrics
* **Historical Data Simulation**: Mock time-series data for demonstration purposes
* **Multi-Provider Support**: AWS, Google Cloud Platform, and Microsoft Azure

## Prerequisites

* **Node.js**: v18.0 or higher
* **npm**: v8.0 or higher (or yarn/pnpm equivalent)
* **Cloudflare API Token**: Required for live data fetching

## Installation

```bash
git clone https://github.com/Vasu1712/latency-topology-visualizer.git
cd latency-topology-visualizer
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
```

### Start the development server

```bash
npm run dev
```

### Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Project Structure

```
src/
├── app/                   # Next.js app router
│   ├── api/               
│   │   └── latency/       # Cloudflare Radar API route
│   └── page.tsx           # main application page
├── components/
│   ├── charts/            # historical latency chart
│   │   └── HistoricalLatencyChart.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── Legend.tsx
│   │   └── navbar/
│   │       ├── SearchBar.tsx
│   │       ├── CloudSelector.tsx
│   │       ├── LatencyRange.tsx
│   │       └── TimeRange.tsx
│   ├── map/
│   │   ├── WorldMap3D.tsx
│   │   ├── ExchangeMarker.tsx
│   │   ├── CloudRegionMarker.tsx
│   │   └── LatencyConnection.tsx
│   └── ui/                # Reusable UI components
├── data/
├── hooks/
│   └── useHistoricalData.ts
├── lib/                   # Utility functions
├── store/
│   └── useStore.ts        # Zustand Store
└── types/                 # TypeScript type definitions
```

### State Management

* **Filter State**: Search queries, selected exchanges, cloud providers, latency ranges
* **Visualization State**: 3D globe visibility controls, theme preferences
* **Data State**: Exchange data, historical latency data, real-time updates

## Dependencies

### Core Framework

* Next.js 14
* React 18
* TypeScript

### 3D Visualization

* Three.js
* @react-three/fiber
* @react-three/drei

### Data Visualization

* Recharts (LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine)

### State Management & Data Fetching

* Zustand

### UI Components & Animation

* Tailwind CSS
* Framer Motion
* Lucide React
* @iconify-icon/react

### Development Tools

* ESLint
* PostCSS
* Autoprefixer

## Configuration

### Environment Variables

```

CLOUDFLARE_API_TOKEN=your_token_here

NEXT_PUBLIC_APP_NAME=CryptoLatency Visualizer
NEXT_PUBLIC_API_BASE_URL=https://api.cloudflare.com/client/v4/radar
```

### API Configuration

* **/quality/speed/top/locations** - Global latency performance data
* **/entities/locations** - Geographic location data

### Data Update Intervals

* Real-time updates: Every 10 seconds
* Historical data refresh: Every 30 seconds
* API cache duration: 1 hour

## Usage

### Basic Operation

1. Click "Get Started" on the landing page
2. Search and select 1-2 exchanges
3. Apply filters: cloud providers, latency threshold, time range
4. View historical latency chart

### Advanced Features

* Multi-exchange comparison
* Legend-based visibility toggles
* Theme switching
* Interactive 3D globe exploration without any Mapping Library, directly from three.js

### Filter Parameters

* Selected Exchanges
* Cloud Providers
* Max Latency
* Time Range

## Key Assumptions

### Data Sources

* Cloudflare Radar API is reliable
* Mock data uses realistic base latency:

  * AWS: 45ms, GCP: 55ms, Azure: 65ms

### Performance Thresholds

* Green: ≤ 50ms
* Yellow: 50-150ms
* Red: > 150ms

### Update Frequencies

* Real-time: Every 10 seconds
* Historical: Every 30 seconds
* Chart points: 48 for 24hrs, 168 for 7 days

### Compatibility

* WebGL-enabled browsers
* Min resolution: 1024x768
* JavaScript required

### Chart Rendering Logic

* Chart shown only when all parameters are selected
* Conditional split-screen chart rendering

## Deployment

### Build Commands

```bash
npm run build       # Production build
npm start           # Start production server
npm run lint        # Lint code
```

### Production Environment

```
CLOUDFLARE_API_TOKEN=your_token
NODE_ENV=production
```

### Performance Considerations

* Optimized static assets
* Code splitting
* Hardware-accelerated 3D
* Memoized chart data

## Development

### Local Development

```bash
npm install
npm run dev
```

## License

MIT License — see LICENSE file


Built with ❤️ for assessment
