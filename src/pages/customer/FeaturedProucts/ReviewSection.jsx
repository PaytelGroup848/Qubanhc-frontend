import { useState } from 'react';
import StarRating from '../../../components/StarRating';
import ReviewModal from './ReviewModal';

export default function ReviewSection({ reviews, productId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const addReview = (newReview) => {
    setLocalReviews([newReview, ...localReviews]);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm hover:bg-teal-700"
        >
          Write a Review
        </button>
      </div>
      {localReviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {localReviews.map((rev) => (
            <div key={rev._id || rev.id} className="border-b pb-4">
              <div className="flex justify-between">
                <span className="font-semibold">{rev.user?.name || rev.user || 'Anonymous'}</span>
                <span className="text-sm text-gray-400">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : rev.date}
                </span>
              </div>
              <StarRating rating={rev.rating} />
              <p className="mt-1 text-gray-600">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onSubmit={addReview}
      />
    </div>
  );
}