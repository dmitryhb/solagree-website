// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    serverAppConfig: false
  },
  ssr: true,
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
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
