import { getContinueWatching, removeFromContinueWatching } from '@/api/continueWatching';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MovieRow from '@/components/ui/MovieRow';
import { useToast } from '@/context/ToastContext';

export default function ContinueWatching() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  const { data: continueWatching, isLoading: cwLoading } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: getContinueWatching,
  });

  const removeMutation = useMutation({
    mutationFn: (movieId) => removeFromContinueWatching(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries(['continue-watching']);
      showToast({
        message: 'Removed from Continue Watching',
        type: 'success',
      });
    },
  });

  const handleRemove = (movieId) => {
    removeMutation.mutate(movieId);
  };

  return (
    <>
      {!cwLoading && continueWatching?.length > 0 && (
        <MovieRow
          title="Continue Watching"
          items={continueWatching}
          isContinueWatching={true}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
