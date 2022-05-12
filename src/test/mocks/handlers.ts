import { rest } from 'msw';
import { DISCOGS_BASE_URL } from '../../services/api';

export default [
  rest.get(`${DISCOGS_BASE_URL}/database/search`, (req, res, ctx) =>
    res(
      ctx.json({
        results: [
          {
            id: 1,
            cover_image: 'https://example.com/cover.jpg',
            title: 'Ghost',
            type: 'artist',
          },
        ],
      })
    )
  ),
  rest.get(`${DISCOGS_BASE_URL}/artists/:artistId/releases`, (req, res, ctx) =>
    res(
      ctx.json({
        pagination: {
          items: 0,
          page: 1,
          pages: 0,
          urls: { last: '', next: '' },
        },
        releases: [],
      })
    )
  ),
];
