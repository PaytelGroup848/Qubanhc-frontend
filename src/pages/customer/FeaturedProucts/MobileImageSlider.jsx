import { useRef, useState } from "react";
import { getImageUrl } from "../../../utils/imageUrl";

export default function MobileImageSlider({ images = [] }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides =
    images && images.length > 0
      ? images
      : [{ url: "/images/placeholder.jpg" }];

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !container.offsetWidth) return;

    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveIndex(Math.min(index, slides.length - 1));
  };

  const goToSlide = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <div className="space-y-3 -mx-4 sm:mx-0">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-slate-50"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map((img, idx) => (
          <div
            key={img._id || img.publicId || idx}
            className="w-full flex-shrink-0 snap-center aspect-square"
          >
            <img
              src={getImageUrl(img?.url || img)}
              alt={`Product image ${idx + 1}`}
              className="w-full h-full object-contain bg-white"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <div className="flex justify-center gap-1.5 px-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeIndex === idx ? "w-5 bg-teal-600" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-1">
            {slides.map((img, idx) => (
              <button
                key={`thumb-${img._id || img.publicId || idx}`}
                type="button"
                aria-label={`Select image ${idx + 1}`}
                onClick={() => goToSlide(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white transition-all ${
                  activeIndex === idx
                    ? "border-teal-500 shadow-sm"
                    : "border-slate-200 opacity-70"
                }`}
              >
                <img
                  src={getImageUrl(img?.url || img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
