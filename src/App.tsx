import type { Artist, GetReleasesResponse, Release } from './types/discogs';
import React from 'react';
import { Releases, SearchBar } from './components';
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
      <div className="col-start-2 col-end-3 text-center">
        <header>
          <h1 className="text-3xl">Pentalog Frontend Challenge</h1>
          <h2 className="text-2xl text-slate-500">
            by{' '}
            <a
              href="https://requejo.dev"
              target="_blank"
              className="underline rounded focus:outline focus:outline-2 focus:outline-offset-2"
            >
              Alejandro Requejo
            </a>
          </h2>
        </header>

        <main className="mt-16 space-y-8">
          <SearchBar
            isSearching={artistQuery.isLoading}
            onSearch={handleSearch}
          />

          {(artistQuery.isLoading ||
            artistQuery.isError ||
            (artistQuery.isSuccess && !artistQuery.data)) && (
            <p>
              {artistQuery.isLoading
                ? 'Searching...'
                : artistQuery.isError
                ? 'Something went wrong.'
                : 'No artist found with that name.'}
            </p>
          )}

          {artistQuery.isSuccess && artistQuery.data && (
            <img
              src={artistQuery.data.cover_image}
              alt={artistQuery.data.title}
              className="block mx-auto rounded shadow-2xl"
            />
          )}

          {!releasesQuery.isIdle && (
            <Releases releases={releases}>
              {!(releasesQuery.isSuccess && releases.length > 0) && (
                <p>
                  {releasesQuery.isLoading
                    ? 'Fetching releases...'
                    : releasesQuery.isError
                    ? 'Something went wrong.'
                    : 'No releases found for this artist.'}
                </p>
              )}

              {releasesQuery.isSuccess &&
                releasesQuery.data &&
                releasesQuery.data.pagination.page <
                  releasesQuery.data.pagination.pages && (
                  <button
                    className="px-4 py-2 bg-slate-900 text-white rounded focus:outline focus:outline-2 focus:outline-offset-2 transition-transform hover:-translate-y-1"
                    onClick={() =>
                      loadReleases(
                        artistQuery.data!.id,
                        releasesQuery.data!.pagination.page + 1
                      )
                    }
                  >
                    Load more
                  </button>
                )}
            </Releases>
          )}
        </main>
      </div>
    </div>
  );
}
