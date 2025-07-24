import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLatency(latency: number): string {
  return `${latency.toFixed(1)}ms`;
}

export function getLatencyStatus(latency: number): 'low' | 'medium' | 'high' {
  if (latency <= 50) return 'low';
  if (latency <= 150) return 'medium';
  return 'high';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}