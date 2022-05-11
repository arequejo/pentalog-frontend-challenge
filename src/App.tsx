import type { Artist, GetReleasesResponse, Release } from './types/discogs';
import React from 'react';
import { SearchBar } from './components';
import { getReleases, search } from './services/api';
import { useAsync } from './hooks';

export default function App() {
  const artistQuery = useAsync<Artist | null>();
  const releasesQuery = useAsync<GetReleasesResponse>();
  const [releases, setReleases] = React.useState<Release[]>([]);

  function resetReleasesData() {
    setReleases([]);
    releasesQuery.reset();
  }

  function handleSearch(term: string) {
    resetReleasesData();
    artistQuery
      .run(
        search(term).then((res) =>
          res.results.length > 0 ? res.results[0] : null
        )
      )
      .then((result) => {
        /**
         * We have to check for the value of `result` because we're chaining
         * on the promise returned by `run` and since our `useAsync` hook
         * catches the errors automatically, we don't know whether this
         * `result` holds the error or the actual resolved value of the promise.
         *
         * Although we could've added a `useEffect` to watch for the value of
         * the artist and then fetch the releases, we would've had to memoize
         * our `loadReleases` function so it could've been properly referenced
         * within such `useEffect` and by the "Load more" button click handler,
         * this eliminates such need.
         */
        if (result instanceof Error || !result) return;
        loadReleases(result.id, 1);
      });
  }

  function loadReleases(artistId: number, page: number) {
    releasesQuery.run(
      getReleases(artistId, {
        page,
      }).then((res) => {
        setReleases((prevReleases) => prevReleases.concat(res.releases));
        return res;
      })
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

        {/* Releases */}
        {!releasesQuery.isIdle && releases.length === 0 && (
          <p className="text-center mt-4">
            {releasesQuery.isLoading
              ? 'Fetching latest releases...'
              : releasesQuery.isError
              ? 'Something went wrong'
              : releasesQuery.isSuccess && releases.length === 0
              ? 'No releases found for this artist.'
              : null}
          </p>
        )}

        {releases.length > 0 && (
          <>
            <div className="grid grid-cols-5 gap-4" data-testid="releases">
              {releases.map((release) => (
                <div
                  key={release.id}
                  className="aspect-square flex items-center justify-center"
                  data-testid="release"
                >
                  <img src={release.thumb} alt={release.title} />
                </div>
              ))}
            </div>
            {releasesQuery.data &&
              releasesQuery.data.pagination.page <
                releasesQuery.data.pagination.pages && (
                <div className="text-center">
                  <button
                    className="px-4 py-2 bg-black text-white rounded"
                    onClick={() =>
                      loadReleases(
                        artistQuery.data!.id,
                        releasesQuery.data!.pagination.page + 1
                      )
                    }
                  >
                    Load more
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
