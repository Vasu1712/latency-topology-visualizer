import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "px-8 py-4",
        "rounded-full",
        "backdrop-blur-xl cursor-pointer",
        "bg-gradient-to-b from-fadeblu/10 to-transparent",
        "bg-black/30",
        "border border-blue-300/30",
        "shadow-lg shadow-black/25",
        "text-blue-300",
        "transition-all duration-300 ease-out",
        "hover:bg-black/40",
        "hover:border-blue-300/50",
        "hover:shadow hover:shadow-blue-400/20",
        "active:scale-[0.98]",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-gradient-to-b before:from-white/20 before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
