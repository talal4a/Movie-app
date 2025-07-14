import { useQuery } from '@tanstack/react-query';
import { getReviewsByMovieId } from '../api/auth';
export default function ReviewList({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsByMovieId(id),
  });
  if (isLoading) return <p className="text-gray-400">Loading reviews...</p>;
  if (isError) return <p className="text-red-400">Failed to load reviews.</p>;
  const reviews = data?.data || [];
  if (reviews.length === 0) {
    return <p className="text-gray-400">No reviews yet.</p>;
  }
  return (
    <div className="mt-6 space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-gray-800 p-4 rounded text-white shadow"
        >
          <p className="text-sm">{review.review}</p>
          <div className="text-yellow-400 text-xs mt-1">
            ⭐ {review.rating}/5
          </div>
        </div>
      ))}
    </div>
  );
}
