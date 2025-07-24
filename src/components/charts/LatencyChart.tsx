'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/glasscard';
import { CHART_TIME_RANGES } from '@/lib/constants';

interface LatencyChartProps {
  selectedTimeRange: keyof typeof CHART_TIME_RANGES;
}

const LatencyChart: React.FC<LatencyChartProps> = ({ selectedTimeRange }) => {
  const { selectedPair, historicalData, theme } = useStore();

  const chartData = useMemo(() => {
    if (!selectedPair || !historicalData[selectedPair]) {
      return [];
    }

    const timeRange = CHART_TIME_RANGES[selectedTimeRange];
    const cutoffTime = Date.now() - timeRange;
    
    return historicalData[selectedPair]
      .filter(data => data.timestamp >= cutoffTime)
      .map(data => ({
        time: new Date(data.timestamp).toLocaleTimeString(),
        latency: data.latency,
        min: data.min,
        max: data.max,
        avg: data.avg,
      }));
  }, [selectedPair, historicalData, selectedTimeRange]);

  if (!selectedPair) {
    return (
      <Card className="p-6 h-64 flex items-center justify-center">
        <p className="text-gray-500">Select an exchange pair to view historical data</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Historical Latency - {selectedPair}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="time" 
              stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              unit="ms"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                color: theme === 'dark' ? '#f9fafb' : '#111827',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Current Latency"
            />
            <Line 
              type="monotone" 
              dataKey="avg" 
              stroke="#10b981" 
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Average"
            />
            <Line 
              type="monotone" 
              dataKey="min" 
              stroke="#06b6d4" 
              strokeWidth={1}
              strokeOpacity={0.5}
              name="Minimum"
            />
            <Line 
              type="monotone" 
              dataKey="max" 
              stroke="#ef4444" 
              strokeWidth={1}
              strokeOpacity={0.5}
              name="Maximum"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LatencyChart;
