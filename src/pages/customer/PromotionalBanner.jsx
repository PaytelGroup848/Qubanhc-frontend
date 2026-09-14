import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import bannerService from "../../services/banner";

const PromotionalBanner = () => {
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotionalBanners = async () => {
      try {
        setLoading(true);
        const response = await bannerService.getActiveBanners("promotional");

        if (response.success && response.data.length > 0) {
          // Sort by position (ascending - lower number = higher priority)
          const sortedBanners = [...response.data].sort((a, b) => {
            if (a.position === b.position) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return (a.position || 0) - (b.position || 0);
          });

          setPromotionalBanners(sortedBanners);
          setCurrentIndex(0);
        } else {
          setPromotionalBanners([]);
        }
      } catch (error) {
        console.error("Error fetching promotional banners:", error);
        setPromotionalBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalBanners();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (promotionalBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % promotionalBanners.length,
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [promotionalBanners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? promotionalBanners.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotionalBanners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="h-[420px] w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 sm:h-[480px] md:h-[560px]" />
    );
  }

  // If no banners, show fallback
  if (promotionalBanners.length === 0) {
    const fallbackBanner = {
      image: "/images/ChatGPT-Image-Jul-11-2026-05_29_50-PM-1024x546.png",
      imageAlt: "qubanhc",
      title: null,
      subtitle: null,
      ctaText: null,
      ctaLink: null,
    };

    return (
      <section className="relative w-full overflow-hidden">
        <img
          src={fallbackBanner.image}
          alt={fallbackBanner.imageAlt}
          className="h-[420px] w-full object-cover object-center sm:h-[420px] md:h-[460px] lg:h-[460px]"
        />
      </section>
    );
  }

  const currentBanner = promotionalBanners[currentIndex];
  const hasContent = Boolean(currentBanner.title || currentBanner.subtitle);

  return (
    <section className="relative w-full overflow-hidden">
      <style>{`
        @keyframes banner-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .banner-anim > * {
          opacity: 0;
          animation: banner-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .banner-anim > *:nth-child(1) { animation-delay: 0.05s; }
        .banner-anim > *:nth-child(2) { animation-delay: 0.18s; }
        .banner-anim > *:nth-child(3) { animation-delay: 0.32s; }
        .banner-anim > *:nth-child(4) { animation-delay: 0.46s; }
        @media (prefers-reduced-motion: reduce) {
          .banner-anim > * { animation: none; opacity: 1; }
        }
        
        /* Slide transition */
        .banner-slide {
          transition: opacity 0.5s ease-in-out;
        }
        .banner-slide-enter {
          opacity: 0;
        }
        .banner-slide-active {
          opacity: 1;
        }
      `}</style>

      <div className="relative">
        {/* Banner Image */}
        <img
          src={currentBanner.image}
          alt={
            currentBanner.imageAlt ||
            currentBanner.title ||
            "Promotional banner"
          }
          className="h-[420px] w-full object-cover object-center sm:h-[480px] md:h-[560px] lg:h-[560px]"
        />

        {hasContent && (
          <>
            {/* Gradient scrim for legibility — strongest on the left, fading right */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,20,18,0.72) 0%, rgba(6,20,18,0.45) 38%, rgba(6,20,18,0.08) 65%, rgba(6,20,18,0) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,20,18,0) 0%, rgba(6,20,18,0.35) 100%)",
              }}
            />

            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="banner-anim max-w-xl">
                  {currentBanner.subtitle && (
                    <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-teal-200 sm:text-sm">
                      <span className="h-px w-8 bg-teal-200/80" />
                      {currentBanner.subtitle}
                    </p>
                  )}

                  {currentBanner.title && (
                    <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                      {currentBanner.title}
                    </h2>
                  )}

                  {currentBanner.description && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                      {currentBanner.description}
                    </p>
                  )}

                  {currentBanner.ctaText && currentBanner.ctaLink && (
                    <a
                      href={currentBanner.ctaLink}
                      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-gray-900 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-xl sm:text-base"
                    >
                      {currentBanner.ctaText}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Controls - Only show if more than 1 banner */}
      {promotionalBanners.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 md:left-6"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 md:right-6"
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {promotionalBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter (optional) */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white md:bottom-6 md:right-6">
            {currentIndex + 1} / {promotionalBanners.length}
          </div>
        </>
      )}
    </section>
  );
};

export default PromotionalBanner;
