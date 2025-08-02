import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReview, upsertReviews } from '../../api/reviews';
import { getReviewsByMovieId } from '../../api/movies';
import UserAvatar from '../ui/UserAvatar';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '@/context/ToastContext';
import Modal from "../Modals/Modal";
import LogoutConfirm from '../Password/LogoutConfirm';
export default function ReviewList({ id }) {
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { showToast } = useToast();
  const user = useSelector((state) => state.user?.user);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsByMovieId(id),
    retry: false,
  });
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId, id);
      setEditingReviewId(null);
      setEditText('');
      setEditRating(5);
      await queryClient.invalidateQueries(['reviews', id]);
      showToast({ message: 'Review deleted successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to delete review:', err);
      showToast({
        message: err.response?.data?.message || 'Failed to delete review',
        type: 'error',
      });
    }
  };
  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.review);
    setEditRating(review.rating);
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertReviews(id, {
        review: editText,
        rating: editRating,
      });
      setEditingReviewId(null);
      queryClient.invalidateQueries(['reviews', id]);
    } catch (err) {
      console.error('Failed to update review:', err);
    }
  };
  const reviews = Array.isArray(data?.data) ? data.data : [];
  if (isLoading) return <p className="text-gray-400">Loading reviews...</p>;
  if (isError) return <p className="text-red-400">Failed to load reviews.</p>;
  return (
    <Modal>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-400">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800 p-4 rounded-lg text-white shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <UserAvatar user={review.user} size={50} />
                  <div>
                    <h4 className="font-medium text-gray-300">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-400">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {editingReviewId === review._id ? (
                  <form
                    onSubmit={handleUpdateSubmit}
                    className="mt-2 ml-[110px] space-y-2"
                  >
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      rows={3}
                    />
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="w-20 p-1 rounded bg-gray-700 text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        onClick={() => {
                          showToast({
                            message: 'Review is updated sucessfully',
                            type: 'success',
                          });
                        }}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId(null)}
                        className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="mt-2 ml-[110px] text-gray-300">
                      {review.review}
                    </p>
                    {review.user?._id === user?.id && (
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => {
                            handleEdit(review);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <Modal.Open opens={`delete-review-${review._id}`}>
                          <button className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-sm">
                            Delete
                          </button>
                        </Modal.Open>
                        <Modal.Window name={`delete-review-${review._id}`}>
                          <LogoutConfirm
                            message={
                              'Are you sure you want to delete this review?'
                            }
                            heading={'Delete Review'}
                            button={'Delete'}
                            onConfirm={async () => {
                              await handleDelete(review._id);
                            }}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
