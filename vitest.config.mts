import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Vitest configuration for CasePort backend integration and unit tests.
 * Tests live in tests/int and use the @/ path alias via tsconfigPaths.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/int/**/*.int.spec.ts'],
    globals: true,
  },
})
