import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { server } from './mocks/server.js';

vi.stubGlobal('alert', vi.fn());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
