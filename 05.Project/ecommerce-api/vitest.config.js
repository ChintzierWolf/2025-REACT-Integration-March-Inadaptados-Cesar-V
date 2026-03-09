import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, // Enable globals for setupFiles and convenience
    setupFiles: ['./tests/setup.js'], // Global setup like MongoDB memory server
    clearMocks: true, // Automatycally clears mock calls before every test
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/**',
        'tests/**',
        'dist/**',
        '**/*.config.js',
        'src/config/**', // Exclude config files from coverage
        'server.js' // Exclude main entry file as it requires full app start
      ]
    }
  }
});
