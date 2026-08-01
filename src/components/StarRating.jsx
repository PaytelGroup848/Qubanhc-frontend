export default function StarRating({ rating, reviews }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-sm">
      <div className="flex text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i}>★</span>
        ))}
        {hasHalfStar && (
          <span className="relative">
            ★
            <span className="absolute inset-0 overflow-hidden w-1/2 text-gray-300">★</span>
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-gray-500 text-xs">({reviews})</span>
      )}
    </div>
  );
}