import { useState, useEffect, useCallback } from 'react';

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export function useDevice(breakpoints = BREAKPOINTS) {
  const [device, setDevice] = useState(() => ({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < breakpoints.mobile : false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  }));

  const checkDevice = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    setDevice({
      width,
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
      isDesktop: width >= breakpoints.tablet,
    });
  }, [breakpoints.mobile, breakpoints.tablet]);

  useEffect(() => {
    checkDevice();
    let timeoutId;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkDevice]);

  return device;
}