import type { Artist } from './types/discogs';
import { SearchBar } from './components';
import { search } from './services/api';
import { useAsync } from './hooks';

export default function App() {
  const artistQuery = useAsync<Artist | null>();

  function handleSearch(term: string) {
    artistQuery.run(
      search(term).then((res) =>
        res.results.length > 0 ? res.results[0] : null
      )
    );
  }

  return (
    <div className="grid grid-cols-[1fr_minmax(900px,_1fr)_1fr]">
      <div className="col-start-2 col-end-3">
        <SearchBar onSearch={handleSearch} />
        {(artistQuery.isLoading ||
          artistQuery.isError ||
          (artistQuery.isSuccess && !artistQuery.data)) && (
          <p className="text-center mt-4">
            {artistQuery.isLoading
              ? 'Searching...'
              : artistQuery.isSuccess
              ? 'No artist found with that name.'
              : 'Something went wrong'}
          </p>
        )}
        {artistQuery.isSuccess && artistQuery.data && (
          <div className="text-center mt-4">
            <img
              src={artistQuery.data.cover_image}
              alt={artistQuery.data.title}
              className="inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );
}
