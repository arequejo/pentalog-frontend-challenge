import type { GetReleasesResponse, SearchResponse } from '../types/discogs';

export const DISCOGS_BASE_URL = 'https://api.discogs.com';
const DISCOGS_ACCESS_TOKEN = import.meta.env.VITE_DISCOGS_ACCESS_TOKEN;

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${DISCOGS_BASE_URL}${path}`);
  if (response.ok) {
    return await response.json();
  }
  return Promise.reject(new Error("Something went wrong with Discogs' API"));
}

export function search(query: string): Promise<SearchResponse> {
  const searchParams = new URLSearchParams({
    token: DISCOGS_ACCESS_TOKEN,
    type: 'artist',
    per_page: '1',
    q: query,
  });
  return get(`/database/search?${searchParams.toString()}`);
}

export function getReleases(
  artistId: number,
  params?: { page?: number }
): Promise<GetReleasesResponse> {
  const searchParams = new URLSearchParams({
    token: DISCOGS_ACCESS_TOKEN,
    sort: 'year',
    sort_order: 'desc',
    page: `${params?.page ?? 1}`,
    per_page: '5',
  });
  return get(`/artists/${artistId}/releases?${searchParams.toString()}`);
}
