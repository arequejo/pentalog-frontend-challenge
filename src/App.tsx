import type { Artist } from './types/discogs';
import React from 'react';
import { SearchBar } from './components';
import { search } from './services/api';

export default function App() {
  const [artist, setArtist] = React.useState<Artist | null>(null);
  const [status, setStatus] = React.useState('idle');

  function handleSearch(term: string) {
    setStatus('loading');
    search(term).then(
      (res) => {
        if (res.results.length > 0) {
          setArtist(res.results[0]);
        }
        setStatus('success');
      },
      () => {
        setArtist(null);
        setStatus('error');
      }
    );
  }

  return (
    <div className="grid grid-cols-[1fr_minmax(900px,_1fr)_1fr]">
      <div className="col-start-2 col-end-3">
        <SearchBar onSearch={handleSearch} />
        {(status === 'loading' ||
          status === 'error' ||
          (status === 'success' && !artist)) && (
          <p className="text-center mt-4">
            {status === 'loading'
              ? 'Searching...'
              : status === 'success'
              ? 'No artist found with that name.'
              : 'Something went wrong'}
          </p>
        )}
        {status === 'success' && artist && (
          <div className="text-center mt-4">
            <img
              src={artist.cover_image}
              alt={artist.title}
              className="inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );
}
