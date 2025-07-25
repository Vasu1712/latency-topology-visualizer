'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export const useHistoricalData = () => {
  const { 
    areChartParametersReady, 
    getChartParameters, 
    updateHistoricalData,
    setChartDataLoading,
    isChartDataLoading,
    filterState
  } = useStore();

  const fetchChartData = async () => {
    const params = getChartParameters();
    if (!params) return;

    console.log('Fetching chart data with parameters:', params);
    setChartDataLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Define the type for historical data points
      interface HistoricalDataPoint {
        timestamp: number;
        latency: number;
        exchangeId: string;
        exchangeName: string;
      }

      // Generate mock historical data based on parameters
      const data: HistoricalDataPoint[] = [];
      const now = Date.now();
      const timeRangeMs = {
        '1hr': 60 * 60 * 1000,
        '6hrs': 6 * 60 * 60 * 1000,
        '12hrs': 12 * 60 * 60 * 1000,
        '24hrs': 24 * 60 * 60 * 1000,
        '7days': 7 * 24 * 60 * 60 * 1000,
        '30days': 30 * 24 * 60 * 60 * 1000,
      };

      const rangeMs = timeRangeMs[params.timeRange as keyof typeof timeRangeMs] || 24 * 60 * 60 * 1000;
      const dataPoints = params.timeRange === '1hr' ? 12 : 
                        params.timeRange === '6hrs' ? 24 :
                        params.timeRange === '12hrs' ? 24 :
                        params.timeRange === '24hrs' ? 48 :
                        params.timeRange === '7days' ? 168 : 720;

      for (let i = dataPoints; i >= 0; i--) {
        const timestamp = now - (i * (rangeMs / dataPoints));
        
        params.exchanges.forEach((exchange) => {
          // Filter by cloud provider
          if (!params.cloudProviders.includes(exchange.cloudProvider)) return;

          // Generate latency based on provider and constraints
          let baseLatency = 60;
          if (exchange.cloudProvider === 'aws') baseLatency = 45;
          if (exchange.cloudProvider === 'gcp') baseLatency = 55;
          if (exchange.cloudProvider === 'azure') baseLatency = 65;

          // Add time-based variation
          const timeVariation = Math.sin((i / dataPoints) * Math.PI * 4) * 15;
          const jitter = (Math.random() - 0.5) * 20;
          
          // Ensure latency doesn't exceed maxLatency
          const latency = Math.min(
            Math.max(10, baseLatency + timeVariation + jitter),
            params.maxLatency
          );

          data.push({
            timestamp,
            latency: Math.round(latency),
            exchangeId: exchange.id,
            exchangeName: exchange.name,
          });
        });
      }

      console.log('Generated chart data:', data.length, 'points');
      updateHistoricalData(data);
      
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setChartDataLoading(false);
    }
  };

  // Fetch data when parameters become ready
  useEffect(() => {
    if (areChartParametersReady()) {
      fetchChartData();
    }
  }, [
    filterState.selectedExchanges,
    filterState.selectedClouds,
    filterState.latencyRange,
    filterState.timeRange
  ]);

  return {
    isLoading: isChartDataLoading,
    canFetchData: areChartParametersReady(),
  };
};
