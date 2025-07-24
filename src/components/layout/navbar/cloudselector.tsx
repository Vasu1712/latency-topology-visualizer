import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';

const CloudSelector: React.FC = () => {
  const { filterState, setSelectedClouds } = useStore();

  const clouds = [
    { id: 'aws', label: 'AWS', color: '#FF9900' },
    { id: 'gcp', label: 'GCP', color: '#34a853' },
    { id: 'azure', label: 'Azure', color: '#0078D4' }
  ];

  const handleCloudToggle = (cloudId: string) => {
    const currentSelected = filterState.selectedClouds;
    
    if (currentSelected.includes(cloudId)) {
      // Remove if already selected
      const newSelected = currentSelected.filter(id => id !== cloudId);
      setSelectedClouds(newSelected);
    } else {
      // Add if not selected
      setSelectedClouds([...currentSelected, cloudId]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-base text-gray-300 font-medium mb-2">Cloud</span>
      <div className="flex gap-8">
        {clouds.map((cloud) => {
          const isSelected = filterState.selectedClouds.includes(cloud.id);
          const textColor = isSelected ? cloud.color : '#FFFFFF';
          const dotColor = isSelected ? cloud.color : '#4A4A4A';

          return (
            <div
              key={cloud.id}
              className="flex items-center space-x-2 cursor-pointer font-light"
              onClick={() => handleCloudToggle(cloud.id)}
            >
              <Label
                htmlFor={cloud.id}
                className={`text-lg font-medium transition-colors duration-200 font-light`}
                style={{ color: textColor }}
                onClick={() => handleCloudToggle(cloud.id)}
              >
                {cloud.label}
              </Label>
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200`}
                style={{
                  backgroundColor: dotColor,
                  borderColor: isSelected ? cloud.color : '#4A4A4A',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudSelector;
