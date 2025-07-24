'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { LatencyData } from '@/lib/types';

const UPDATE_INTERVAL = 10000; // 10 seconds

export const useRealTimeLatency = () => {
  const { 
    isStarted, 
    setExchanges, 
    setCloudRegions, 
    updateLatencyData,
    exchanges,
    cloudRegions 
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate mock latency connections between exchanges and cloud regions
  const generateLatencyConnections = (): LatencyData[] => {
    const connections: LatencyData[] = [];
    
    exchanges.forEach((exchange, exchangeIndex) => {
      // Create 2-3 connections per exchange to different cloud regions
      const numConnections = Math.floor(Math.random() * 2) + 2; // 2-3 connections
      
      for (let i = 0; i < numConnections && i < cloudRegions.length; i++) {
        const targetRegion = cloudRegions[(exchangeIndex + i) % cloudRegions.length];
        
        // Calculate distance-based latency (rough approximation)
        const distance = Math.sqrt(
          Math.pow(exchange.position[0] - targetRegion.position[0], 2) +
          Math.pow(exchange.position[1] - targetRegion.position[1], 2)
        );
        
        // Base latency on distance with some randomization
        const baseLatency = Math.min(distance * 8 + Math.random() * 50, 400);
        const latency = Math.round(baseLatency + Math.random() * 30); // Add jitter
        
        let status: 'low' | 'medium' | 'high' = 'high';
        if (latency < 50) status = 'low';
        else if (latency <= 150) status = 'medium';
        
        connections.push({
          id: `latency-${exchange.id}-${targetRegion.id}`,
          source: exchange.id,
          target: targetRegion.id,
          latency,
          timestamp: Date.now(),
          status,
        });
      }
    });
    
    return connections;
  };

  const fetchLatencyData = async () => {
    if (!isStarted) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/latency', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.exchanges && data.cloudRegions) {
        setExchanges(data.exchanges);
        setCloudRegions(data.cloudRegions);
        
        // Generate latency connections after updating exchanges and regions
        setTimeout(() => {
          const latencyConnections = generateLatencyConnections();
          updateLatencyData(latencyConnections);
        }, 100); // Small delay to ensure stores are updated
        
        setLastUpdated(new Date());
        console.log(`Latency data updated at ${new Date().toLocaleTimeString()}`);
      } else {
        throw new Error(data.error || 'Invalid data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch latency data:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Start periodic updates when the globe is started
  useEffect(() => {
    if (isStarted) {
      fetchLatencyData();
      intervalRef.current = setInterval(fetchLatencyData, UPDATE_INTERVAL);
      console.log('Started real-time latency updates (every 10 seconds)');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      console.log('Stopped real-time latency updates');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isStarted, exchanges.length, cloudRegions.length]);

  const refreshData = () => {
    fetchLatencyData();
  };

  return {
    isLoading,
    lastUpdated,
    error,
    refreshData,
  };
};
