import { screen, within, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setup } from './test/utils';
import server from './test/mocks/server';
import { DISCOGS_BASE_URL } from './services/api';
import App from './App';

describe('<App />', () => {
  test('can search for an artist and see their releases', async () => {
    server.use(
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
      rest.get(
        `${DISCOGS_BASE_URL}/artists/:artistId/releases`,
        (req, res, ctx) =>
          res(
            ctx.json({
              pagination: {
                items: 10,
                page: 1,
                pages: 2,
              },
              releases: [
                { id: 1, thumb: '', title: 'Release 1' },
                { id: 2, thumb: '', title: 'Release 2' },
                { id: 3, thumb: '', title: 'Release 3' },
                { id: 4, thumb: '', title: 'Release 4' },
                { id: 5, thumb: '', title: 'Release 5' },
              ],
            })
          )
      )
    );

    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, 'ghost{Enter}');

    // Check that the term was added to history
    screen.getByRole('button', { name: 'ghost' });
    screen.getByRole('button', { name: /remove ghost from history/i });

    // Check for artit's cover image
    await screen.findByRole('img', { name: 'Ghost' });

    // Check initial set of releases
    const releases = await screen.findByTestId('releases');
    expect(await within(releases).findAllByRole('img')).toHaveLength(5);

    server.use(
      rest.get(
        `${DISCOGS_BASE_URL}/artists/:artistId/releases`,
        (req, res, ctx) =>
          res(
            ctx.json({
              pagination: {
                items: 10,
                page: 2,
                pages: 2,
              },
              releases: [
                { id: 6, thumb: '', title: 'Release 6' },
                { id: 7, thumb: '', title: 'Release 7' },
                { id: 8, thumb: '', title: 'Release 8' },
                { id: 9, thumb: '', title: 'Release 9' },
                { id: 10, thumb: '', title: 'Release 10' },
              ],
            })
          )
      )
    );

    // ...now after clicking on "Load more"
    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    await user.click(loadMoreButton);
    await waitFor(() => {
      expect(within(releases).getAllByRole('img')).toHaveLength(10);
    });
    expect(loadMoreButton).not.toBeInTheDocument();
  });

  test('can search by the history buttons', async () => {
    server.use(
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
      )
    );

    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);

    // First artist
    await user.type(searchBar, 'ghost{Enter}');
    await screen.findByRole('img', { name: 'Ghost' });

    server.use(
      rest.get(`${DISCOGS_BASE_URL}/database/search`, (req, res, ctx) =>
        res(
          ctx.json({
            results: [
              {
                id: 1,
                cover_image: 'https://example.com/cover.jpg',
                title: 'Iron Maiden',
                type: 'artist',
              },
            ],
          })
        )
      )
    );

    // Second artist
    await user.clear(searchBar);
    await user.type(searchBar, 'iron maiden{Enter}');
    await screen.findByRole('img', { name: 'Iron Maiden' });

    // Check history and click on first artist
    expect(screen.getAllByRole('button')).toHaveLength(4); // 2 buttons per history item

    server.use(
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
      )
    );

    await user.click(screen.getByRole('button', { name: 'ghost' }));
    expect(searchBar).toHaveValue('ghost');
    await screen.findByRole('img', { name: 'Ghost' });
    await user.click(
      screen.getByRole('button', { name: /remove iron maiden from history/i })
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('shows a message when an artist could not be found', async () => {
    server.use(
      rest.get(`${DISCOGS_BASE_URL}/database/search`, (req, res, ctx) =>
        res(ctx.json({ results: [] }))
      )
    );

    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, 'ghost{Enter}');

    await screen.findByText(/no artist found/i);
    expect(
      screen.queryByRole('heading', { name: /releases/i })
    ).not.toBeInTheDocument();
  });

  test('shows a message when an error happens while searching for an artist', async () => {
    server.use(
      rest.get(`${DISCOGS_BASE_URL}/database/search`, (req, res, ctx) =>
        res.networkError('Error')
      )
    );

    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, 'ghost{Enter}');

    await screen.findByText(/something went wrong/i);
    expect(
      screen.queryByRole('heading', { name: /releases/i })
    ).not.toBeInTheDocument();
  });

  test('does not search for an artist if the term is empty', async () => {
    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, '   {Enter}');
    await user.clear(searchBar);
    await user.type(searchBar, '{Enter}');

    expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /releases/i })
    ).not.toBeInTheDocument();
  });

  test('shows a message when no releases are found', async () => {
    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, 'ghost{Enter}');

    await screen.findByText(/no releases found/i);
  });

  test('shows a message when an error happens while fetching releases', async () => {
    server.use(
      rest.get(
        `${DISCOGS_BASE_URL}/artists/:artistId/releases`,
        (req, res, ctx) => res.networkError('Error')
      )
    );

    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, 'ghost{Enter}');

    await screen.findByText(/something went wrong/i);
  });
});
