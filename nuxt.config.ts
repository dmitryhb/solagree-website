// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#ffffff' }],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  experimental: {
    serverAppConfig: false
  },
  ssr: true,
  modules: ['@nuxt/ui'],
  css: ['~/assets/styles/vendor.css', '~/assets/styles/main.scss'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.solagree.com',
      portalApiBaseUrl: process.env.NUXT_PUBLIC_PORTAL_API_BASE_URL || 'http://localhost:3001',
      solagreeQuiz: {
        hostId: 'solagree-quiz',
        mode: 'standalone',
        display: {
          showShellHeader: true,
          showExplainer: true
        },
        analytics: {
          enabled: false,
          namespace: 'solagree.quiz'
        },
        bridge: {
          postMessage: false,
          targetOrigin: '*'
        },
        ctas: {
          'solagree-consult': {
            href: '#solagree-consult-placeholder'
          },
          'attorney-consult': {
            href: '#attorney-consult-placeholder'
          },
          'fallback-resources': {
            href: '#fallback-resources'
          }
        }
      }
    }
  },
  devServer: {
    port: 3003
  }
})
