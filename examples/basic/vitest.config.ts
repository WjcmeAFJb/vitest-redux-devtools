import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    // Tests sharing one process keeps a single DevTools session for the run.
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
  },
})
