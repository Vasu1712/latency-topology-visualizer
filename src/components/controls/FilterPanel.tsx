'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { CLOUD_PROVIDERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/glasscard';
import { Switch } from '@/components/ui/toggleSwitch';

const FilterPanel: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    isRealTime, 
    toggleRealTime,
    theme,
    toggleTheme 
  } = useStore();

  const handleProviderToggle = (providerId: string) => {
    const updatedProviders = filters.providers.includes(providerId)
      ? filters.providers.filter(id => id !== providerId)
      : [...filters.providers, providerId];
    
    setFilters({ providers: updatedProviders });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Filters & Controls</h3>
      
      {/* Real-time toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Real-time Updates</label>
        <Switch checked={isRealTime} onCheckedChange={toggleRealTime} />
      </div>

      {/* Theme toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Dark Mode</label>
        <Switch 
          checked={theme === 'dark'} 
          onCheckedChange={toggleTheme} 
        />
      </div>

      {/* Cloud provider filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cloud Providers</label>
        {Object.values(CLOUD_PROVIDERS).map((provider) => (
          <div key={provider.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={provider.id}
              checked={filters.providers.includes(provider.id)}
              onChange={() => handleProviderToggle(provider.id)}
              className="rounded"
            />
            <label 
              htmlFor={provider.id} 
              className="text-sm flex items-center space-x-2"
            >
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: provider.color }}
              />
              <span>{provider.name}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Latency range filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Latency Range: {filters.latencyRange[0]}ms - {filters.latencyRange[1]}ms
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.latencyRange[1]}
          onChange={(e) => 
            setFilters({ 
              latencyRange: [filters.latencyRange[0], parseInt(e.target.value)] 
            })
          }
          className="w-full"
        />
      </div>
    </Card>
  );
};

export default FilterPanel;
