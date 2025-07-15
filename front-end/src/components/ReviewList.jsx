import { useInfiniteQuery } from '@tanstack/react-query';
import { getReviewsByMovieId } from '../api/auth';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ReviewList({ id }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['reviews', id],
    queryFn: ({ pageParam = 1 }) => getReviewsByMovieId(id, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Assuming your API returns hasMore and nextPage in the response
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  // Flatten all pages of reviews
  const reviews = data?.pages.flatMap(page => page.data) || [];

  if (isLoading) return <p className="text-gray-400">Loading reviews...</p>;
  if (isError) return <p className="text-red-400">Failed to load reviews.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      ) : (
        <div 
          id="scrollableDiv"
          className="overflow-y-auto"
          style={{ maxHeight: '500px' }} // Adjust height as needed
        >
          <InfiniteScroll
            dataLength={reviews.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<p className="text-gray-400 text-center py-4">Loading more reviews...</p>}
            scrollableTarget="scrollableDiv"
            endMessage={
              <p className="text-center text-gray-500 mt-4">
                You've seen all reviews!
              </p>
            }
          >
            <div className="space-y-4 pr-2">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-800 p-4 rounded-lg text-white shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-300">
                        {review.user?.name || 'Anonymous'}
                      </h4>
                      <div className="flex items-center mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-600'
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
                  <p className="mt-2 text-gray-300">{review.review}</p>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
