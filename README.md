# Pentalog Frontend Challenge by Alejandro Requejo

## Before running the project

1. Make sure you get a Personal Access Token from [Discogs](https://www.discogs.com/developers)
1. Create a `.env.local` file at the root of the project with the token: `VITE_DISCOGS_ACCESS_TOKEN=MY_TOKEN_ABC_123`

## Running the project

1. Run `npm install` to install dependencies
1. Run `npm run build` to build the project for production
1. Run `npm run preview` to start a local web server
1. Run `npm run test` to run unit/integration tests
1. Run `npm run test:e2e` to run end-to-end tests

## About the project

Once we search for an artist, we pick the first result returned from Discogs (since the results are ordered by relevance) and display the cover image. If an artist was found, we then look for their most recent releases five items at a time.

The project covers all the basic requirements, including:

- No external libraries with the exception of a _utility_ library for styling: `Tailwind CSS`.
- Tests. All the application's unit/integration tests are performed with `Vitest`, a runner with a `Jest`-compatible API. The tests themselves are written with the `React Testing Library` and `msw` to deal with HTTP requests. A single end-to-end test was also written with `Playwright` and covers the overall functionality of the application.
- TypeScript. No JavaScript is used at all, everything is written in TypeScript.
- Responsive. The power of CSS Grid is leveraged to achieve proper responsiveness without writing media queries (except for the styles applied to the body tag with Tailwind CSS).
- Accessible. The application is fully accessible with proper focus handling and color contrast. Also, with the way the tests are written we make sure to prioritize its overall accessibility.
- Paginated. The releases are paginated five at a time, with the ability to load more results as needed until we reach the last page.
- Error handling. The requests sent to Discogs are "protected" so if anything goes wrong with the request the error will be caught properly.

The project was bootstrapped with `Vite`.
