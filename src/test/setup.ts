import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'whatwg-fetch'; // Needed so `fetch` can be properly used in our tests
import server from './mocks/server';

vi.stubGlobal('alert', vi.fn());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
