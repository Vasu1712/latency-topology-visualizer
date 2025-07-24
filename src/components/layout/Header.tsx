'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify-icon/react';
import GlassButton from '@/components/ui/glassbutton';

const Header: React.FC = () => {
  const { theme, setStarted,  } = useStore();

  const handleGetStarted = () => {
    setStarted(true);
  };

  return (
    <div className={`h-screen w-screen overflow-hidden px-12 py-16 relative ${theme === 'dark' ? 'bg-mainbg text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="mb-6">
            <h1 className="text-8xl font-bold">Latency Topology Visualizer</h1>
        </div>
        <div className="flex flex-col justify-around w-3/5 pr-4 h-full">
            <p className="text-gray-500 mt-2 text-2xl font-thin italic">
              Real-time visualization of exchange server latency across cloud providers
            </p>
            <div>
              <GlassButton className="text-2xl font-semibold z-20" onClick={handleGetStarted}>
                Get Started
              </GlassButton>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <a href="https://github.com/Vasu1712" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Icon icon="mage:github" width="32" />
              </a>
              <p className="space-y-2 text-lg">
                Vasu1712
              </p>
            </div>
          </div>
    </div>
  );
};

export default Header;
function setStarted(arg0: boolean) {
  throw new Error('Function not implemented.');
}

