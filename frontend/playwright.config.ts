import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:80',
  },
})
