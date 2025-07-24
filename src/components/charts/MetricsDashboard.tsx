'use client';

import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/glasscard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Activity, Server, Globe, Zap } from 'lucide-react';
import { CLOUD_PROVIDERS, LATENCY_THRESHOLDS } from '@/lib/constants';

const MetricsDashboard: React.FC = () => {
  const { exchanges, latencyData, cloudRegions, theme } = useStore();

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalConnections = latencyData.length;
    const avgLatency = latencyData.length > 0 
      ? latencyData.reduce((sum, d) => sum + d.latency, 0) / latencyData.length 
      : 0;

    const statusCounts = latencyData.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const providerCounts = exchanges.reduce((acc, e) => {
      acc[e.cloudProvider] = (acc[e.cloudProvider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConnections,
      avgLatency,
      statusCounts,
      providerCounts,
      activeExchanges: exchanges.filter(e => e.status === 'online').length,
      totalRegions: cloudRegions.length,
    };
  }, [exchanges, latencyData, cloudRegions]);

  // Prepare chart data
  const latencyDistributionData = useMemo(() => {
    const ranges = [
      { range: '0-50ms', min: 0, max: 50, color: '#10b981' },
      { range: '51-100ms', min: 51, max: 100, color: '#f59e0b' },
      { range: '101-200ms', min: 101, max: 200, color: '#ef4444' },
      { range: '200ms+', min: 201, max: Infinity, color: '#7c2d12' },
    ];

    return ranges.map(r => ({
      ...r,
      count: latencyData.filter(d => d.latency >= r.min && d.latency <= r.max).length,
    }));
  }, [latencyData]);

  const providerData = useMemo(() => {
    return Object.entries(metrics.providerCounts).map(([provider, count]) => ({
      name: CLOUD_PROVIDERS[provider].name,
      value: count,
      color: CLOUD_PROVIDERS[provider].color,
    }));
  }, [metrics.providerCounts]);

  const realtimeLatencyData = useMemo(() => {
    // Get last 20 data points for real-time chart
    return latencyData
      .slice(-20)
      .map((d, index) => ({
        time: `T-${20 - index}`,
        latency: d.latency,
      }));
  }, [latencyData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Key Metrics Cards */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Connections
              </p>
              <p className="text-2xl font-bold">{metrics.totalConnections}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Latency
              </p>
              <p className="text-2xl font-bold">
                {metrics.avgLatency.toFixed(1)}ms
              </p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Exchanges
              </p>
              <p className="text-2xl font-bold">{metrics.activeExchanges}</p>
            </div>
            <Server className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Cloud Regions
              </p>
              <p className="text-2xl font-bold">{metrics.totalRegions}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Latency Distribution Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Latency Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyDistributionData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="range" 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  }}
                />
                <Bar dataKey="count">
                  {latencyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Provider Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Latency Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realtimeLatencyData}>
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
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDashboard;
