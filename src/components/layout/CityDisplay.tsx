'use client';
import { useStore } from '@/store/useStore';


const CityDisplay = () => {
  const { hoveredCity } = useStore();

  if (!hoveredCity) {
    return null;
  }

  return (
    <div className="w-1/6 py-1 px-2 rounded-full cityglass flex justify-center absolute bottom-10 left-20 z-20 pointer-events-none transition-opacity duration-300">
      <p className="text-lg font-medium text-white transition-opacity duration-300">
        <span className="font-thin text-gray-200">Location:</span> {hoveredCity}
      </p>
    </div>
  );
};

export default CityDisplay;