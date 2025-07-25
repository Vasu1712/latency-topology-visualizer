'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Icon } from '@iconify-icon/react';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from '../ui/toggleSwitch';

interface LegendItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const LegendItem: React.FC<LegendItemProps> = ({ 
  icon, 
  label, 
  description, 
  count, 
  isActive = true,
  onClick 
}) => (
  <motion.div
    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
      isActive 
        ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
        : 'bg-gray-800/30 opacity-50'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && (
          <div className="text-xs text-gray-400 mt-0.5">{description}</div>
        )}
      </div>
    </div>
    {count !== undefined && (
      <div className="text-xs font-mono bg-gray-500/20 text-white px-2 py-1 rounded">
        {count}
      </div>
    )}
  </motion.div>
);

const Legend: React.FC = () => {
    const {
    isStarted,
    exchanges,
    cloudRegions,
    latencyData,
    filters,
    visibility,
    toggleExchanges,
    toggleConnections,
    toggleRegions,
    getLatencyStats,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'markers' | 'connections' | 'settings'>('markers');
  const legendRef = useRef<HTMLDivElement>(null);
  const latencyStats = getLatencyStats();

  const exchangesByProvider = {
    aws: exchanges.filter(e => e.cloudProvider === 'aws').length,
    gcp: exchanges.filter(e => e.cloudProvider === 'gcp').length,
    azure: exchanges.filter(e => e.cloudProvider === 'azure').length,
  };

  const regionsByProvider = {
    aws: cloudRegions.filter(r => r.provider === 'aws').length,
    gcp: cloudRegions.filter(r => r.provider === 'gcp').length,
    azure: cloudRegions.filter(r => r.provider === 'azure').length,
  };

  const tabs = [
    { id: 'markers', label: 'Markers', icon: 'lucide:map-pin' },
    { id: 'connections', label: 'Connections', icon: 'lucide:network' },
    { id: 'settings', label: 'Settings', icon: 'lucide:settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legendRef.current && !legendRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isStarted) return null;

  return (
    <div ref={legendRef} className="absolute bottom-24 right-4 z-30 legendglass rounded-full">
      <motion.button
        className=" p-4 rounded-full shadow-2xl flex justify-center border border-white/20 hover:from-blue-500/80 hover:to-purple-500/80 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        <Icon 
          icon={isOpen ? "lucide:x" : "lucide:layers"} 
          className="w-6 h-6 text-white" 
        />
      </motion.button>

      {/* Legend Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-80 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black-600/10 to-black-600/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:map" className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-white">Map Legend</h3>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex mt-3 bg-white/5 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gray-500/20 text-gray-200 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setActiveTab(tab.id as 'markers' | 'connections' | 'settings')}
                  >
                    <Icon icon={tab.icon} className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'markers' && (
                  <motion.div
                    key="markers"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Exchange Servers */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <Icon icon="lucide:server" className="w-4 h-4 mr-2" />
                        Exchange Servers ({exchanges.length})
                      </h4>
                      <div className="space-y-2">
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse" />
                              <div className="absolute inset-0 w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-30" />
                            </div>
                          }
                          label="AWS Exchanges"
                          description="Amazon Web Services"
                          count={exchangesByProvider.aws}
                          isActive={filters.providers.includes('aws')}
                        />
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" />
                              <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-30" />
                            </div>
                          }
                          label="GCP Exchanges"
                          description="Google Cloud Platform"
                          count={exchangesByProvider.gcp}
                          isActive={filters.providers.includes('gcp')}
                        />
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full animate-pulse" />
                              <div className="absolute inset-0 w-4 h-4 bg-cyan-500 rounded-full animate-ping opacity-30" />
                            </div>
                          }
                          label="Azure Exchanges"
                          description="Microsoft Azure"
                          count={exchangesByProvider.azure}
                          isActive={filters.providers.includes('azure')}
                        />
                      </div>
                    </div>

                    {/* Cloud Regions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <Icon icon="lucide:cloud" className="w-4 h-4 mr-2" />
                        Cloud Regions ({cloudRegions.length})
                      </h4>
                      <div className="space-y-2">
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-5 h-5 bg-white rounded-full border-2 border-white shadow-sm" />
                              <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                            </div>
                          }
                          label="AWS Regions"
                          count={regionsByProvider.aws}
                        />
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-5 h-5 bg-white rounded-full border-2 border-white shadow-sm" />
                              <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                            </div>
                          }
                          label="GCP Regions"
                          count={regionsByProvider.gcp}
                        />
                        <LegendItem
                          icon={
                            <div className="relative">
                              <div className="w-5 h-5 bg-white rounded-full border-2 border-white shadow-sm" />
                              <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full" />
                            </div>
                          }
                          label="Azure Regions"
                          count={regionsByProvider.azure}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'connections' && (
                  <motion.div
                    key="connections"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <Icon icon="lucide:activity" className="w-4 h-4 mr-2" />
                        Latency Connections ({latencyData.length})
                      </h4>
                      <div className="space-y-2">
                        <LegendItem
                          icon={
                            <div className="flex items-center">
                              <div className="w-8 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/30 animate-pulse" />
                              </div>
                            </div>
                          }
                          label="Excellent"
                          description="< 50ms latency"
                          count={latencyStats.low}
                        />
                        <LegendItem
                          icon={
                            <div className="flex items-center">
                              <div className="w-8 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/30 animate-pulse" />
                              </div>
                            </div>
                          }
                          label="Good"
                          description="50-150ms latency"
                          count={latencyStats.medium}
                        />
                        <LegendItem
                          icon={
                            <div className="flex items-center">
                              <div className="w-8 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/30 animate-pulse" />
                              </div>
                            </div>
                          }
                          label="Poor"
                          description="> 150ms latency"
                          count={latencyStats.high}
                        />
                      </div>
                    </div>

                    {/* Real-time Stats */}
                    <div className="bg-gradient-to-r from-black-500/10 to-gray-500/10 rounded-lg p-3 border border-gray-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Network Status</span>
                            <div className="flex items-center space-x-1 text-xs">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-300">Active</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white/5 rounded p-2">
                                <div className="text-gray-400">Avg Latency</div>
                                <div className="text-white font-mono">
                                    {latencyData.length > 0
                                        ? `${(latencyData.reduce((sum, l) => sum + l.latency, 0) / latencyData.length).toFixed(1)}ms`
                                        : '0ms'
                                    }
                                </div>
                            </div>
                            <div className="bg-white/5 rounded p-2">
                                <div className="text-gray-400">Total Connections</div>
                                <div className="text-white font-mono">{latencyData.length}</div>
                            </div>
                    </div>
                    {/* Latency Distribution */}
                    <div className="bg-white/5 rounded-lg p-3 mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                        <Icon icon="lucide:bar-chart" className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-gray-400">Latency Distribution</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-white">{latencyStats.low}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className="text-white">{latencyStats.medium}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-white">{latencyStats.high}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <Icon icon="lucide:eye" className="w-4 h-4 mr-2" />
                        Visibility Controls
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <Icon icon="lucide:server" className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-white font-medium">Show Exchanges</span>
                              <div className="text-xs text-gray-400">Display crypto exchange servers</div>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={visibility.showExchanges}
                            onToggle={toggleExchanges}
                            color="blue"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <Icon icon="lucide:activity" className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-white font-medium">Show Connections</span>
                              <div className="text-xs text-gray-400">Display latency connections</div>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={visibility.showConnections}
                            onToggle={toggleConnections}
                            color="green"
                          />
                        </div>

                        {/* Regions Toggle */}
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <Icon icon="lucide:cloud" className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm text-white font-medium">Show Regions</span>
                              <div className="text-xs text-gray-400">Display cloud regions</div>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={visibility.showRegions}
                            onToggle={toggleRegions}
                            color="purple"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <Icon icon="lucide:refresh-cw" className="w-4 h-4 mr-2" />
                        Update Settings
                      </h4>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Refresh Rate</span>
                          <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded">10s</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Data updates automatically every 10 seconds
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-00/50 to-gray-900/50 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <div className="flex items-center space-x-1">
                  <Icon icon="lucide:wifi" className="w-3 h-3" />
                  <span>Cloudflare Radar</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Legend;
