import { useState, useEffect } from 'react';

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  orientation: 'portrait' | 'landscape';
  devicePixelRatio: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide';
}

const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
};

export const useResponsive = (customBreakpoints?: Partial<ResponsiveBreakpoints>): ResponsiveState => {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };
  
  const [responsive, setResponsive] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        isWide: false,
        orientation: 'landscape',
        devicePixelRatio: 1,
        breakpoint: 'tablet'
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    return {
      width,
      height,
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
      isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
      isWide: width >= breakpoints.wide,
      orientation: width > height ? 'landscape' : 'portrait',
      devicePixelRatio,
      breakpoint: width < breakpoints.mobile ? 'mobile' 
                : width < breakpoints.desktop ? 'tablet'
                : width < breakpoints.wide ? 'desktop' 
                : 'wide'
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        setResponsive({
          width,
          height,
          isMobile: width < breakpoints.mobile,
          isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
          isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
          isWide: width >= breakpoints.wide,
          orientation: width > height ? 'landscape' : 'portrait',
          devicePixelRatio,
          breakpoint: width < breakpoints.mobile ? 'mobile' 
                    : width < breakpoints.desktop ? 'tablet'
                    : width < breakpoints.wide ? 'desktop' 
                    : 'wide'
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoints]);

  return responsive;
};

// Utility hook for media queries in JavaScript
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addListener(handleChange);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
};

// Prebuilt responsive hooks for common use cases
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
