import React from 'react';
import { useLocalState } from '../hooks';

interface SearchBarProps {
  isSearching: boolean;
  onSearch: (term: string) => void;
}

export default function SearchBar({ isSearching, onSearch }: SearchBarProps) {
  /**
   * Using a state variable so can we evaluate on each render if its trimmed
   * value is "empty".
   */
  const [term, setTerm] = React.useState('');
  const [history, setHistory] = useLocalState<string[]>('history', []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTerm = term.trim();
    if (!trimmedTerm || isSearching) return;
    if (!history.includes(trimmedTerm)) {
      setHistory((prevHistory) => prevHistory.concat([trimmedTerm]));
    }
    onSearch(trimmedTerm);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search" className="block text-2xl">
          Search for an artist:
        </label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Daft Punk, Ghost, etc."
          className="block w-full rounded text-2xl p-4 shadow mt-4 border-2 border-slate-900 bg-white focus:outline focus:outline-2 focus:outline-offset-2"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </form>

      <div className="flex flex-wrap gap-4 mt-4">
        {history.map((searchedTerm) => (
          <span key={searchedTerm}>
            <button
              className="px-2 py-1 border-2 border-slate-900 bg-slate-900 text-white rounded-tl rounded-bl focus:outline focus:outline-2 focus:outline-offset-2"
              onClick={() => {
                setTerm(searchedTerm);
                onSearch(searchedTerm);
              }}
            >
              {searchedTerm}
            </button>

            <button
              aria-label={`Remove ${searchedTerm} from history`}
              className="px-2 py-1 border-2 border-slate-900 bg-white rounded-tr rounded-br focus:outline focus:outline-2 focus:outline-offset-2"
              onClick={() => {
                setHistory((prevHistory) =>
                  prevHistory.filter(
                    (prevSearchedTerm) => prevSearchedTerm !== searchedTerm
                  )
                );
              }}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </>
  );
}
