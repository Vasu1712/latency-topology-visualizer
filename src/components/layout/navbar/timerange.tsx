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
import { Icon } from '@iconify-icon/react';
import { Label } from '@/components/ui/label';

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

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-fade-blue/80 font-medium">Time Range</span>
      <Select value={filterState.timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/15">
          <div className="flex items-center space-x-2">
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-black-900/95 backdrop-blur-xl border-white/10">
          {timeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRange;
