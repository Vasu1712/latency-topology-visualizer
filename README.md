# Latency Topology Visualizer

A Next.js application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

## Features

- **3D Interactive World Map**: Built with Three.js and React Three Fiber
- **Real-time Latency Visualization**: Animated connections with color-coded latency indicators
- **Exchange Server Locations**: Interactive markers for major cryptocurrency exchanges
- **Cloud Provider Regions**: Visual representation of AWS, GCP, and Azure regions
- **Historical Data Charts**: Time-series analysis with customizable time ranges
- **Responsive Design**: Mobile-optimized with touch controls
- **Dark/Light Theme**: Toggle between themes
- **Performance Optimized**: Efficient 3D rendering and state management

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Animation**: Framer Motion
- **UI Components**: Custom components with Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:

git clone <your-repo-url>
cd latency-topology-visualizer

2. Install dependencies:

npm install

3. Run the development server:

npm run dev


4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

src/
├── app/ # Next.js app router
├── components/ # React components
│ ├── ui/ # Reusable UI components
│ ├── map/ # 3D map related components
│ ├── charts/ # Chart components
│ └── controls/ # Control panel components
├── hooks/ # Custom React hooks
├── lib/ # Utilities and types
├── store/ # Zustand state management
└── data/ # Mock data and constants


## Key Components

### WorldMap3D
- Main 3D visualization component
- Handles Earth rendering, camera controls, and marker positioning

### ExchangeMarker
- Interactive 3D markers for exchange servers
- Shows exchange information on hover/click
- Color-coded by cloud provider

### LatencyConnection
- Animated connections between exchanges
- Curved lines with moving pulses
- Color-coded by latency levels

### FilterPanel
- Control panel for filtering and settings
- Real-time toggle, theme switching
- Cloud provider and latency range filters

## Performance Optimizations

- Dynamic imports for 3D components (SSR compatibility)
- Efficient state management with Zustand
- Optimized 3D rendering with React Three Fiber
- Debounced user interactions
- Lazy loading of components

## Customization

### Adding New Exchanges

Edit `src/data/mockData.ts` to add new exchanges:

{
id: 'new-exchange',
name: 'New Exchange',
position: [latitude, longitude, 0],
cloudProvider: 'aws' | 'gcp' | 'azure',
region: 'region-code',
status: 'online' | 'offline' | 'maintenance',
}


### API Integration

Replace mock data with actual API calls in:
- `src/hooks/useLatencyData.ts` for real-time latency data
- `src/app/api/latency/route.ts` for backend API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
