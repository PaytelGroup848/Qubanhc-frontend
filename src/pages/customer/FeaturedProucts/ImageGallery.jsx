import { useState } from 'react';
import { getImageUrl } from '../../../utils/imageUrl';

export default function ImageGallery({ images, isMobile }) {
  const [mainImage, setMainImage] = useState(images?.[0] || null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
        <img
          src="/images/placeholder.jpg"
          alt="No product image available"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[520px] pr-1`}>
        {images.map((img, idx) => {
          const active = mainImage === img;
          return (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              aria-label={`View image ${idx + 1}`}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-slate-50 ${
                active
                  ? 'border-emerald-500 shadow-md shadow-emerald-100'
                  : 'border-slate-200 hover:border-emerald-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(img.url || img)}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
        <img
          src={getImageUrl(mainImage?.url || mainImage)}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}