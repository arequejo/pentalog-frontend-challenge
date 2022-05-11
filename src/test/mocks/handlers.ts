import { rest } from 'msw';
import { DISCOGS_BASE_URL } from '../../services/api';

export default [
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
