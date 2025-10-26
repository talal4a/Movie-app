import Review from '../Features/Review';
import ReviewsList from '../Features/ReviewList';
export default function MovieReviews({ id, refetchMovie }) {
  return (
    <>
      <Review id={id} refetchMovie={refetchMovie} />
      <ReviewsList id={id} />
    </>
  );
}
