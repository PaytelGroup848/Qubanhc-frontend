import { lazy, Suspense, memo, useEffect, useState, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;

const HeroDesktop = lazy(() => import('./HeroDesktop'));
const HeroMobile = lazy(() => import('./HeroMobile'));

const HeroSkeleton = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <div className="h-8 w-36 animate-pulse rounded-full bg-teal-100" />
          <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-12 w-3/5 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-5 w-full animate-pulse rounded-full bg-gray-100" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-gray-100" />
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-36 animate-pulse rounded-full bg-teal-100" />
            <div className="h-12 w-36 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="h-[360px] animate-pulse rounded-[2rem] bg-gradient-to-br from-teal-100 to-emerald-100" />
      </div>
    </div>
  </section>
);

const Hero = memo(() => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();

    let timeoutId;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 120);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return (
    <Suspense fallback={<HeroSkeleton />}>
      {isMobile ? <HeroMobile /> : <HeroDesktop />}
    </Suspense>
  );
});

Hero.displayName = 'Hero';

export default Hero;
