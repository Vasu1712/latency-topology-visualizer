import React from 'react';
import { useStore } from '@/store/useStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const LatencyRange: React.FC = () => {

  const { filterState, setLatencyRange } = useStore();

  const currentMaxLatency = filterState.latencyRange[1];

  const handleLatencyChange = (values: number[]) => {
    if (values && values.length > 0) {
      setLatencyRange(values[0]);
    }
  };

  return (
    <div className="flex flex-col w-48">
      <span className="text-base text-gray-200 font-medium">Latency Range</span>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/30 font-thin min-w-[55px] text-right">
          {currentMaxLatency}ms
        </span>
        <div className="flex items-center gap-3">
          <Slider
            value={[currentMaxLatency]}
            onValueChange={handleLatencyChange}
            max={600}
            min={0}
            step={10}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default LatencyRange;
