'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { LatencyData } from '@/lib/types';
import { UPDATE_INTERVAL } from '@/lib/constants';

export const useLatencyData = () => {
  const { updateLatencyData, isRealTime, exchanges } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data generator for demonstration
  const generateMockLatencyData = (): LatencyData[] => {
    const data: LatencyData[] = [];
    
    for (let i = 0; i < exchanges.length - 1; i++) {
      for (let j = i + 1; j < exchanges.length; j++) {
        const latency = Math.random() * 300 + 10; // 10-310ms
        const status = latency <= 50 ? 'low' : latency <= 150 ? 'medium' : 'high';
        
        data.push({
          id: `${exchanges[i].id}-${exchanges[j].id}`,
          source: exchanges[i].id,
          target: exchanges[j].id,
          latency,
          timestamp: Date.now(),
          status,
        });
      }
    }
    
    return data;
  };

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTime && exchanges.length > 0) {
      const fetchData = () => {
        const newData = generateMockLatencyData();
        updateLatencyData(newData);
      };

      fetchData(); // Initial fetch
      intervalRef.current = setInterval(fetchData, UPDATE_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRealTime, exchanges, updateLatencyData]);

  // For production, you would replace the mock data with actual API calls:
  /*
  const fetchRealLatencyData = async (): Promise<LatencyData[]> => {
    try {
      const response = await fetch('/api/latency');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch latency data:', error);
      return [];
    }
  };
  */
};
