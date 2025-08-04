import {
  getContinueWatching,
  removeFromContinueWatching,
} from '@/api/continueWatching';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MovieCard from '@/components/ui/MovieCard';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const REMOVAL_COOLDOWN = 10000;
export default function ContinueWatching() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const removedItems = useRef(new Map());
  const { user, token } = useSelector((state) => state.user);
  const userId = user?.id;
  const isAuthenticated = !!token;
  const { data: continueWatchingData = { list: [] }, isLoading: cwLoading } =
    useQuery({
      queryKey: ['continue-watching', userId],
      queryFn: async () => {
        if (!token || !userId) {
          return { list: [] };
        }
        try {
          const response = await getContinueWatching();
          return Array.isArray(response) ? { list: response } : response;
        } catch (error) {
          console.error('Error fetching continue watching:', error);
          if (error.response?.status === 401) {
            navigate('/auth/login', { replace: true });
          }

          return { list: [] };
        }
      },
      enabled: !!token && !!userId,
      select: (data) => {
        const now = Date.now();

        const validList = Array.isArray(data?.list) ? data.list : [];

        return {
          ...data,
          list: validList.filter((item) => {
            if (!item || !item._id) return false;
            const removedAt = removedItems.current.get(item._id);
            return !removedAt || now - removedAt > REMOVAL_COOLDOWN;
          }),
        };
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
      await queryClient.cancelQueries(['continue-watching', userId]);
      const previousData = queryClient.getQueryData([
        'continue-watching',
        userId,
      ]) || { list: [] };

      queryClient.setQueryData(
        ['continue-watching', userId],
        (oldData = { list: [] }) => ({
          ...oldData,
          list: oldData.list.filter((item) => item._id !== movieId),
        })
      );

      return { previousData };
    },
    onError: (error, movieId, context) => {
      console.error('Error removing from continue watching:', error);
      if (context?.previousData) {
        queryClient.setQueryData(
          ['continue-watching', userId],
          context.previousData
        );
      }
      showToast({
        message: error.message || 'Failed to remove from Continue Watching',
        type: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['continue-watching', userId]);
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
    removeMutation.mutate(movieId);
  };

  if (cwLoading) return <Spinner />;
  if (!continueWatchingData.list.length) return null;

  return (
    <section className="px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Continue Watching
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {continueWatchingData.list.map((item) => (
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
