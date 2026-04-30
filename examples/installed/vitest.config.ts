import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
  },
})
