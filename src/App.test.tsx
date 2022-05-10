import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { setup } from './test/utils';
import server from './test/mocks/server';
import { DISCOGS_BASE_URL } from './services/api';
import App from './App';

describe('<App />', () => {
  test('can search for an artist', async () => {
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
    await user.type(searchBar, 'ghost{Enter}');
    await screen.findByRole('img', { name: 'Ghost' });
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
  });

  test('does not search for an artist if the term is empty', async () => {
    const { user } = setup(<App />);

    const searchBar = screen.getByLabelText(/search/i);
    await user.type(searchBar, '   {Enter}');
    await user.clear(searchBar);
    await user.type(searchBar, '{Enter}');

    expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
  });
});
