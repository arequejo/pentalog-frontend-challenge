interface Pagination {
  items: number;
  page: number;
  pages: number;
}

export interface Artist {
  cover_image: string;
  id: number;
  title: string;
  type: 'artist';
}

export interface SearchResponse {
  pagination: Pagination;
  results: Artist[];
}
