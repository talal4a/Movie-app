import {
  getContinueWatching,
  removeFromContinueWatching,
} from '@/api/continueWatching';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MovieCard from '@/components/ui/MovieCard';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { useEffect, useRef } from 'react';
const REMOVAL_COOLDOWN = 10000;
export default function ContinueWatching() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const removedItems = useRef(new Map());
  const { data: continueWatching, isLoading: cwLoading } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: getContinueWatching,
    select: (data) => {
      const now = Date.now();

      return data.filter((item) => {
        const removedAt = removedItems.current.get(item._id);
        return !removedAt || now - removedAt > REMOVAL_COOLDOWN;
      });
    },
  });
  const removeMutation = useMutation({
    mutationFn: async (movieId) => {
      const response = await removeFromContinueWatching(movieId);
      if (!response.success) {
        throw new Error(
          response.message || 'Failed to remove from Continue Watching'
        );
      }
      return response;
    },
    onMutate: async (movieId) => {
      await queryClient.cancelQueries(['continue-watching']);
      const previousList =
        queryClient.getQueryData(['continue-watching']) || [];

      queryClient.setQueryData(
        ['continue-watching'],
        previousList.filter((item) => item._id !== movieId)
      );
      return { previousList };
    },
    onError: (error, movieId, context) => {
      console.error('Error removing from continue watching:', error);
      if (context?.previousList) {
        queryClient.setQueryData(['continue-watching'], context.previousList);
      }
      showToast({
        message: error.message || 'Failed to remove from Continue Watching',
        type: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['continue-watching']);
    },
    onSuccess: (data) => {
      showToast({
        message: data.message || 'Removed from Continue Watching',
        type: 'success',
      });
    },
  });

  const handleRemove = (movieId) => {
    removedItems.current.set(movieId, Date.now());

    queryClient.setQueryData(
      ['continue-watching'],
      (oldData) => oldData?.filter((item) => item._id !== movieId) || []
    );

    removeMutation.mutate(movieId, {
      onError: () => {
        removedItems.current.delete(movieId);
      },
    });
  };

  if (cwLoading) return <Spinner />;
  if (!continueWatching?.length) return null;

  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Continue Watching
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {continueWatching.map((item) => (
          <div key={item._id} className="relative">
            <MovieCard movie={item.movie} disableLink={true} />
            <button
              onClick={() => handleRemove(item.movie._id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
