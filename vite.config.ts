/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    clearMocks: true,
    environment: 'jsdom',
    globals: true,
    include: ['./src/**/*.test.{ts,tsx}'],
    setupFiles: './src/test/setup.ts',
  },
});
