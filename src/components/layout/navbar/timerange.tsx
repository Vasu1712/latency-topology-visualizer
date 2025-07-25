'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TimeRange: React.FC = () => {
  const { filterState, setTimeRange } = useStore();

  const timeOptions = [
    { value: '1hr', label: '1 Hour', description: 'Last hour' },
    { value: '6hrs', label: '6 Hours', description: 'Last 6 hours' },
    { value: '12hrs', label: '12 Hours', description: 'Last 12 hours' },
    { value: '24hrs', label: '24 Hours', description: 'Last day' },
    { value: '7days', label: '7 Days', description: 'Last week' },
    { value: '30days', label: '30 Days', description: 'Last month' }
  ];

  const selectedOption = timeOptions.find(option => option.value === filterState.timeRange);
  const otherParametersReady = filterState.selectedExchanges.length > 0 && 
                               filterState.selectedClouds.length > 0 && 
                               filterState.latencyRange[1] > 0;

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={filterState.timeRange} 
        onValueChange={setTimeRange}
        disabled={!otherParametersReady}
      >
        <SelectTrigger className={`bg-white/10 border-white/20 text-white focus:bg-white/15 ${
          !otherParametersReady ? 'opacity-50 cursor-not-allowed' : ''
        }`}>

        <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
          {timeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-white/60">{option.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!otherParametersReady && (
        <div className="text-xs text-yellow-400/80 rounded">
          Select other params first
        </div>
      )}
    </div>
  );
};

export default TimeRange;