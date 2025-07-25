/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ReferenceLine,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { Icon } from '@iconify-icon/react';

interface HistoricalLatencyChartProps {
  className?: string;
}

const HistoricalLatencyChart: React.FC<HistoricalLatencyChartProps> = ({ className }) => {
  const {
    theme,
    filterState,
    historicalLatencyData,
    getChartParameters
  } = useStore();

  const { isLoading, canFetchData } = useHistoricalData();

  // Process data for chart
  const chartData = useMemo(() => {
    if (!historicalLatencyData.length) return [];

    const groupedData = historicalLatencyData.reduce((acc, point) => {
      const timeKey = point.timestamp;
      if (!acc[timeKey]) {
        acc[timeKey] = {
          timestamp: timeKey,
          time: new Date(timeKey).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(filterState.timeRange !== '24hrs' && filterState.timeRange !== '12hrs' && 
                filterState.timeRange !== '6hrs' && filterState.timeRange !== '1hr' && 
                { month: 'short', day: 'numeric' })
          }),
        };
      }
      acc[timeKey][point.exchangeId] = point.latency;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData).sort((a: any, b: any) => a.timestamp - b.timestamp);
  }, [historicalLatencyData, filterState.timeRange]);

  const parameters = getChartParameters();

  // Show parameter collection status
  if (!canFetchData) {
    return (
      <div className={`${className} ${
        theme === 'dark' ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200/50'
      } rounded-xl border backdrop-blur-xl shadow-lg`}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Historical Latency Chart
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <Icon icon="lucide:settings" className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-white/30' : 'text-gray-300'
              }`} />
              <p className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
              }`}>
                Configure Parameters to View Chart
              </p>
            </div>

            {/* Parameter Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  filterState.selectedExchanges.length > 0 ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                  Server Exchange Pairs ({filterState.selectedExchanges.length}/2 selected)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  filterState.selectedClouds.length > 0 ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                  Cloud Providers ({filterState.selectedClouds.length} selected)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  filterState.latencyRange[1] > 0 ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                  Max Latency ({filterState.latencyRange[1]}ms)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  filterState.timeRange ? 'bg-green-500' : 'bg-red-400'
                }`} />
                <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                  Time Range {filterState.timeRange ? `(${filterState.timeRange})` : '(Not selected)'}
                </span>
              </div>
            </div>

            <div className={`text-sm p-3 rounded-lg ${
              theme === 'dark' ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'
            }`}>
              Select all parameters in the navbar above. The chart will automatically load when you choose a time range.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${className} ${
        theme === 'dark' ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200/50'
      } rounded-xl border backdrop-blur-xl shadow-lg`}>
        <div className="flex items-center justify-center h-64 p-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-500'
            }`}>
              Fetching Historical Data...
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white/40' : 'text-gray-400'
            }`}>
              Loading {parameters?.timeRange} data for {parameters?.exchanges.length} exchange(s)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show chart if data is available
  if (chartData.length === 0) {
    return (
      <div className={`${className} ${
        theme === 'dark' ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200/50'
      } rounded-xl border backdrop-blur-xl shadow-lg`}>
        <div className="flex items-center justify-center h-64 p-6">
          <div className="text-center">
            <Icon icon="lucide:bar-chart" className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-white/30' : 'text-gray-300'
            }`} />
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-500'
            }`}>
              No Data Available
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white/40' : 'text-gray-400'
            }`}>
              Try adjusting your filter parameters
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className={`${className} ${
      theme === 'dark' ? 'bg-gray-900/95 border-white/10 glass' : 'bg-white/95 border-gray-200/50 legendglass'
    } rounded-xl border backdrop-blur-xl shadow-lg`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className={`flex items-center space-x-2 text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-200'
          }`}>
            <Icon icon="lucide:trending-up" className="w-5 h-5" />
            <span>Historical Latency Analysis</span>
          </h3>
          <div className="flex items-center space-x-2">
            <Icon icon="lucide:clock" className={`w-4 h-4 ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-500'
            }`} />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-500'
            }`}>
              {filterState.timeRange}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                opacity={0.3}
              />
              <XAxis 
                dataKey="time"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickLine={false}
                domain={[0, filterState.latencyRange[1]]}
                label={{ 
                  value: 'Latency (ms)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{
                  color: theme === 'dark' ? '#f9fafb' : '#111827',
                }}
              />
              <Legend />

              <ReferenceLine y={50} stroke="#10B981" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={150} stroke="#F59E0B" strokeDasharray="2 2" opacity={0.5} />
               <ReferenceLine y={filterState.latencyRange[1]} stroke="#EF4444" strokeDasharray="2 2" opacity={0.8} />

              {filterState.selectedExchanges.map((exchange, index) => (
                <Line
                  key={exchange.id}
                  type="monotone"
                  dataKey={exchange.id}
                  stroke={chartColors[index]}
                  strokeWidth={2}
                  dot={{ fill: chartColors[index], strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: chartColors[index], strokeWidth: 2 }}
                  name={exchange.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoricalLatencyChart;
