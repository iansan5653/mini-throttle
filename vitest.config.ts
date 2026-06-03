import {defineConfig} from 'vitest/config'
import {playwright} from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    include: ['test/**/*.ts'],
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium'
        }
      ],
      provider: playwright(),
      headless: true
    }
  }
})
