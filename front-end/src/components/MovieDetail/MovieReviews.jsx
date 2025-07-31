import Review from '../Review';
import ReviewsList from '../ReviewList';
export default function MovieReviews({ id, refetchMovie }) {
  return (
    <>
      <Review id={id} refetchMovie={refetchMovie} />
      <ReviewsList id={id} />
    </>
  );
}
