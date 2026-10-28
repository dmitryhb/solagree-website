import { defineConfig } from 'vitest/config'
import base from './vitest.config'

// This suite exercises Nuxt client-only composables rather than silently testing their disabled SSR branches.
export default defineConfig({
  ...base,
  plugins: [...(base.plugins ?? []), {
    name: 'analytics-client-compile-flags',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('/node_modules/')) return
      return { code: code.replace(/import\.meta\.client\b/g, 'true').replace(/import\.meta\.server\b/g, 'false'), map: null }
    }
  }],
  define: { 'import.meta.client': 'true', 'import.meta.server': 'false' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/vitest.setup.ts'],
    include: ['./tests/analytics-lifecycle.client.spec.ts']
  }
})
