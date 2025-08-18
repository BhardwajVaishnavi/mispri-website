'use client';

import { useEffect } from 'react';

export default function ConsoleCleaner() {
  useEffect(() => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Filter out tracking prevention messages
    console.warn = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('Tracking Prevention blocked') ||
        message.includes('was preloaded using link preload but not used') ||
        message.includes('Facebook Pixel') ||
        message.includes('Meta Pixel')
      ) {
        // Suppress these specific warnings
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('Tracking Prevention blocked') ||
        message.includes('storage access')
      ) {
        // Suppress these specific errors
        return;
      }
      originalError.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null;
}
