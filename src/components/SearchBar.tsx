import React from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  /**
   * Using a state variable so can we evaluate on each render if its trimmed
   * value is "empty".
   */
  const [term, setTerm] = React.useState('');
  const trimmedTerm = term.trim();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedTerm) return;
    onSearch(trimmedTerm);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search" className="block text-2xl">
        Search
      </label>
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Daft Punk, Ghost, etc."
        className="block w-full rounded text-2xl p-4 shadow mt-4"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
    </form>
  );
}
