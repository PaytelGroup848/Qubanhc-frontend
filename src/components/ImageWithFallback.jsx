import { useState } from 'react';

export default function ImageWithFallback({ src, alt, className, fallbackIcon = '📦' }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 text-6xl`}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`${className} animate-pulse bg-gray-200`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}