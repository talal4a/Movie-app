import { getContinueWatching } from '@/api/continueWatching';
import { useQuery } from '@tanstack/react-query';
import MovieRow from '@/components/ui/MovieRow';
export default function ContinueWatching() {
  const { data: continueWatching, isLoading: cwLoading } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: getContinueWatching,
  });
  return (
    <>
      {!cwLoading && continueWatching?.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatching.map((item) => item.movie)}
        />
      )}
    </>
  );
}
