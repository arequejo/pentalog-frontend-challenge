interface Urls {
  last?: string;
  next?: string;
}

interface Pagination {
  items: number;
  page: number;
  pages: number;
  urls: Urls;
}

interface BaseResponse {
  pagination: Pagination;
}

export interface Artist {
  cover_image: string;
  id: number;
  title: string;
  type: 'artist';
}

export interface SearchResponse extends BaseResponse {
  results: Artist[];
}

export interface Release {
  id: number;
  thumb: string;
  title: string;
  year: number;
}

export interface GetReleasesResponse extends BaseResponse {
  releases: Release[];
}
