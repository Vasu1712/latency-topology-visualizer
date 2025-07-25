'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { useRealTimeLatency } from '@/hooks/useRealTimeLatency';

const RealTimeStatus = () => {
  const { isStarted, lastDataUpdate } = useStore();
  const { isLoading, error } = useRealTimeLatency();

  if (!isStarted) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          error ? 'bg-red-500' : isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'
        }`} />
        <span className={`font-medium text-green-500 ${
          error ? 'bg-red-500' : isLoading ? 'text-yellow-500 animate-pulse' : 'text-green-600'
        }`}>
          {error ? 'Connection Error' : isLoading ? 'Updating...' : 'Live'}
        </span>
      </div>
      {lastDataUpdate && (
        <div className="text-xs text-gray-600 mt-1">
          last update: {lastDataUpdate.toLocaleTimeString()}
        </div>
      )}
      {error && (
        <div className="text-xs text-red-300 mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default RealTimeStatus;
