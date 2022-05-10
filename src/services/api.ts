import type { SearchResponse } from '../types/discogs';

export const DISCOGS_BASE_URL = 'https://api.discogs.com';
const DISCOGS_ACCESS_TOKEN = import.meta.env.VITE_DISCOGS_ACCESS_TOKEN;

export function search(query: string): Promise<SearchResponse> {
  const params = new URLSearchParams({
    token: DISCOGS_ACCESS_TOKEN,
    type: 'artist',
    q: query,
  });
  return window
    .fetch(`${DISCOGS_BASE_URL}/database/search?${params.toString()}`)
    .then((res) => res.json());
}
