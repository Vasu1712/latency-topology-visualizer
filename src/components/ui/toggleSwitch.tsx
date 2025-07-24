'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  enabled, 
  onToggle, 
  label,
  size = 'md',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-4', toggle: 'w-3 h-3' },
    md: { container: 'w-10 h-5', toggle: 'w-4 h-4' },
    lg: { container: 'w-12 h-6', toggle: 'w-5 h-5' },
  };

  const colorClasses = {
    blue: enabled ? 'bg-gray-500' : 'bg-gray-800',
    green: enabled ? 'bg-gray-500' : 'bg-gray-800',
    purple: enabled ? 'bg-gray-500' : 'bg-gray-800',
    orange: enabled ? 'bg-gray-500' : 'bg-gray-800',
    red: enabled ? 'bg-gray-500' : 'bg-gray-800',
  };

  return (
    <div className="flex items-center space-x-2">
      {label && (
        <span className="text-sm text-white font-medium">{label}</span>
      )}
      <button
        onClick={onToggle}
        className={`${sizeClasses[size].container} ${colorClasses[color]} rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20`}
      >
        <motion.div
          className={`${sizeClasses[size].toggle} bg-white rounded-full shadow-sm absolute top-0.5`}
          animate={{
            x: enabled ? 
              (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 2
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
