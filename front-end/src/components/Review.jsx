import { postReviews } from '../api/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
export default function Review({ id }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const queryClient = useQueryClient();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postReviews(id, { review: text, rating });
      queryClient.invalidateQueries(['reviews', id]);
      setText('');
      setRating(5);
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-white mb-2">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white mb-2"
          placeholder="Share your thoughts..."
          rows={3}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-20 p-2 rounded bg-gray-700 text-white mr-2"
        />
        <button
          type="submit"
          className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
