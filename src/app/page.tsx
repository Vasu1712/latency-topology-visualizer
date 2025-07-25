'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/navbar/Navbar';
import { exchangesData } from '@/data/exchanges';
import CityDisplay from '@/components/layout/CityDisplay';
import RealTimeStatus from '@/components/layout/RealTimeStatus';
import Legend from '@/components/layout/Legend';
import HistoricalLatencyChart from '@/components/charts/HistoricalLatencyChart';
import { useHistoricalData } from '@/hooks/useHistoricalData';


const WorldMap3D = dynamic(
  () => import('@/components/map/WorldMap3D'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function Home() {
  const { theme, isStarted, setExchanges, setCloudRegions, filterState } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useHistoricalData();
  
  const showChart = filterState.selectedExchanges.length > 0;

  console.log('Chart should show:', showChart);
  console.log('Selected exchanges:', filterState.selectedExchanges);
  

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
      {showChart && (
            <div className="w-full h-full z-10 absolute top-80 left-0 p-4">
              <HistoricalLatencyChart className="w-1/2" />
          </div>
        )}
      <CityDisplay />
      <Legend />
      <RealTimeStatus />
    </div>
  );
}
