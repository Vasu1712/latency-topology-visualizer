'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';
import GlassButton from '../../ui/glassbutton';
import SearchBar from './searchbar';
import CloudSelector from './cloudselector';
import LatencyRange from './latencyrange';
import TimeRange from './timerange';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <div className="px-12 py-6 z-20">
      <nav className={`w-full backdrop-blur-xl bg-black/30 border border-gray-600 rounded-full p-2 glass  ${theme === 'dark' ? 'bg-black/30 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-around gap-6">
          <SearchBar />
          <div className="h-16 w-px bg-white/20" />
          <CloudSelector />
          <div className="h-16 w-px bg-white/20" />
          <LatencyRange />
          <div className="h-16 w-px bg-white/20" />
          <TimeRange />
          <GlassButton
            onClick={toggleTheme}
            className="px-3 py-3 text-base"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </GlassButton>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;