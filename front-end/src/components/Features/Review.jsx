import { getReviewsByMovieId } from '../../api/movies';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StarRating from './StarRating';
import { postReviews } from '@/api/reviews';
import { useToast } from '@/context/ToastContext';

export default function Review({ id, refetchMovie }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [myReview, setMyReview] = useState(null);

  const user = useSelector((state) => state.user?.user);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsByMovieId(id),
  });

  const { mutate, isLoading: isPosting } = useMutation({
    mutationFn: (newReview) => postReviews(id, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);

      if (refetchMovie) {
        refetchMovie();
      }

      setText('');
      setRating(0);
      showToast({ message: 'Review submitted successfully!', type: 'success' });
    },
    onError: (error) => {
      console.error('Failed to post review:', error);
      showToast({
        message: error.response?.data?.message || 'Failed to submit review.',
        type: 'error',
      });
    },
  });

  useEffect(() => {
    if (!user?.id || !Array.isArray(reviewsData?.data)) return;
    const review = reviewsData.data.find((r) => r.user?._id === user.id);
    setHasReviewed(!!review);
    setMyReview(review || null);
    if (!review) {
      setRating(0);
    }
  }, [reviewsData?.data, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPosting || !text.trim() || rating === 0) {
      showToast({
        message: 'Please provide a review and a rating.',
        type: 'error',
      });
      return;
    }

    mutate({ review: text, rating });
  };

  return (
    <div className="mt-8 px-4 sm:px-6 md:px-8">
      <h3 className="text-lg font-semibold text-white mb-4 text-center sm:text-left">
        Write a Review
      </h3>
      {isReviewsLoading ? (
        <p className="text-gray-400 text-center">Loading review status...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              placeholder="Share your thoughts"
              rows={4}
              disabled={hasReviewed || isPosting}
            />
            <div className="w-full flex justify-center items-center p-3 rounded bg-gray-700 text-white">
              {hasReviewed ? (
                <p className="text-green-500 font-bold text-[18px] text-center">
                  ✅ Your rating is: {myReview.rating} ⭐
                </p>
              ) : (
                <StarRating
                  value={rating}
                  onChange={(val) => setRating(val)}
                  size={40}
                  disabled={hasReviewed || isPosting}
                  showText={true}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end mt-5">
            <button
              type="submit"
              disabled={
                hasReviewed || isPosting || !text.trim() || rating === 0
              }
              className={`w-full sm:w-auto px-4 py-2 rounded text-white transition-colors duration-300 ${
                hasReviewed || isPosting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {isPosting
                ? 'Submitting...'
                : hasReviewed
                  ? 'Review Submitted'
                  : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
