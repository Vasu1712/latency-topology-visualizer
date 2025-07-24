'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl",
        "bg-white/10 border border-white/20 backdrop-blur-lg",
        "shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
