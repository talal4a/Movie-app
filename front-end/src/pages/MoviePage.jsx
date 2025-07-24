import MultiCollectionMovies from '@/components/CollectionMovie';

export default function MoviesPage() {
  return (
    <main className="p-10">
      <MultiCollectionMovies
        collectionNames={[
          'Friday the 13th Collection',
          'Jurassic World Franchise',
          'Popular Jim Carrey Movies',
        ]}
      />
    </main>
  );
}
