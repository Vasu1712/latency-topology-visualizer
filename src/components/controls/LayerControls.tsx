'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/glasscard';
import { Switch } from '@/components/ui/toggleSwitch';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Layers, Globe, Zap, BarChart3 } from 'lucide-react';

interface LayerControlsProps {
  layers: {
    exchanges: boolean;
    cloudRegions: boolean;
    latencyConnections: boolean;
    heatmap: boolean;
    networkPaths: boolean;
    historicalData: boolean;
  };
  onLayerToggle: (layer: keyof LayerControlsProps['layers']) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ layers, onLayerToggle }) => {
  const { theme } = useStore();

  const layerConfig = [
    {
      key: 'exchanges' as const,
      label: 'Exchange Markers',
      icon: Globe,
      description: 'Show cryptocurrency exchange locations',
    },
    {
      key: 'cloudRegions' as const,
      label: 'Cloud Regions',
      icon: Layers,
      description: 'Display AWS, GCP, and Azure regions',
    },
    {
      key: 'latencyConnections' as const,
      label: 'Latency Connections',
      icon: Zap,
      description: 'Real-time latency visualization',
    },
    {
      key: 'heatmap' as const,
      label: 'Latency Heatmap',
      icon: BarChart3,
      description: 'Global latency heat overlay',
    },
    {
      key: 'networkPaths' as const,
      label: 'Network Paths',
      icon: Eye,
      description: 'Connection topology paths',
    },
    {
      key: 'historicalData' as const,
      label: 'Historical Trends',
      icon: BarChart3,
      description: 'Historical latency data',
    },
  ];

  const toggleAll = (enabled: boolean) => {
    Object.keys(layers).forEach(layer => {
      onLayerToggle(layer as keyof typeof layers);
    });
  };

  const enabledCount = Object.values(layers).filter(Boolean).length;
  const totalCount = Object.keys(layers).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Visualization Layers</span>
          </span>
          <span className="text-sm font-normal text-gray-500">
            {enabledCount}/{totalCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(true)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Show All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(false)}
            className="flex-1"
          >
            <EyeOff className="h-4 w-4 mr-1" />
            Hide All
          </Button>
        </div>

        {/* Individual Layer Controls */}
        <div className="space-y-3">
          {layerConfig.map((layer) => {
            const Icon = layer.icon;
            const isEnabled = layers[layer.key];
            
            return (
              <div
                key={layer.key}
                className="flex items-center justify-between p-3 rounded-lg border 
                         border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
                         transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isEnabled 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{layer.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {layer.description}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => onLayerToggle(layer.key)}
                />
              </div>
            );
          })}
        </div>

        {/* Performance Info */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-yellow-800 dark:text-yellow-200">
              More layers may impact 3D rendering performance
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerControls;
