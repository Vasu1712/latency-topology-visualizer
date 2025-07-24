'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { useLatencyData } from '@/hooks/useLatencyData';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/navbar/Navbar';
import { exchangesData } from '@/data/exchanges';
import CityDisplay from '@/components/layout/CityDisplay';
import RealTimeStatus from '@/components/layout/RealTimeStatus';
import Legend from '@/components/layout/Legend';

const WorldMap3D = dynamic(
  () => import('@/components/map/WorldMap3D'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function Home() {
  const { theme, isStarted, setExchanges, setCloudRegions } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // useLatencyData();

   useEffect(() => {
    setExchanges(exchangesData);
  }, [setExchanges]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/latency');
        const data = await response.json();
        
        if (data.exchanges && data.cloudRegions) {
          setExchanges(data.exchanges);
          setCloudRegions(data.cloudRegions);
        }
        console.log('Fetched data:', data);
      } catch (error) {
        console.error("Failed to fetch real-time data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setExchanges, setCloudRegions]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`h-screen w-screen overflow-hidden relative ${theme === 'dark'}`}>
      <div className="absolute inset-0 z-10">
        <WorldMap3D />
      </div>

      <div className="relative flex flex-col mx-auto h-full">
        {isStarted ? (
          <Navbar />
        ) : (
          <Header />
        )}
      </div>
      <CityDisplay />
      <Legend />
      <RealTimeStatus />
    </div>
  );
}
