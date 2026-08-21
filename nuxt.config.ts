const DEV_PORTAL_API_BASE_URL = 'http://solagree-portal.local:3004'
const PRODUCTION_GA_MEASUREMENT_ID = 'G-TCGL2PDNNY'
const isProduction = process.env.NODE_ENV === 'production'
const portalApiBaseUrl = process.env.NUXT_PUBLIC_PORTAL_API_BASE_URL?.trim()
  || (isProduction ? '' : DEV_PORTAL_API_BASE_URL)
const portalUrl = process.env.NUXT_PUBLIC_PORTAL_URL?.trim()
  || portalApiBaseUrl
const gaMeasurementId = process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  || (isProduction ? PRODUCTION_GA_MEASUREMENT_ID : '')
const ignoredSourcemapWarningPlugins = new Set([
  'nuxt:module-preload-polyfill',
  '@tailwindcss/vite:generate:build'
])

const isIgnoredSourcemapWarning = (warning: { message?: string, plugin?: string }): boolean => {
  if (warning.message?.includes('Sourcemap is likely to be incorrect') !== true) {
    return false
  }

  return (warning.plugin !== undefined && ignoredSourcemapWarningPlugins.has(warning.plugin))
    || [...ignoredSourcemapWarningPlugins].some(plugin => warning.message?.includes(plugin) === true)
}

const shouldSuppressSourcemapWarningMessage = (message: string): boolean => {
  return message.includes('Sourcemap is likely to be incorrect')
    && [...ignoredSourcemapWarningPlugins].some(plugin => message.includes(plugin))
}

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
      ],
      script: gaMeasurementId
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
              async: true
            },
            {
              innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { send_page_view: false });
`
            }
          ]
        : []
    }
  },
  experimental: {
    serverAppConfig: false
  },
  ssr: true,
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/styles/vendor.css', '~/assets/styles/main.scss'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (isIgnoredSourcemapWarning(warning)) {
            return
          }

          warn(warning)
        }
      }
    }
  },
  hooks: {
    'vite:extendConfig'(config) {
      const logger = config.customLogger

      if (!logger) {
        return
      }

      const warn = logger.warn.bind(logger)

      logger.warn = (message, options) => {
        if (typeof message === 'string' && shouldSuppressSourcemapWarningMessage(message)) {
          return
        }

        warn(message, options)
      }
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.solagree.com',
      portalUrl,
      portalApiBaseUrl,
      gaMeasurementId,
      initialConsultBooking: {
        firstAvailableEventPath: process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH?.trim() || '',
        tajEventPath: process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH?.trim() || '',
        stacieEventPath: process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH?.trim() || '',
        jessicaEventPath: process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JESSICA_EVENT_PATH?.trim() || '',
        jamesEventPath: process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH?.trim() || ''
      },
      solagreeQuiz: {
        hostId: 'solagree-quiz',
        mode: 'standalone',
        display: {
          showShellHeader: true,
          showExplainer: true
        },
        analytics: {
          enabled: true,
          namespace: 'solagree.quiz',
          trackingId: gaMeasurementId || undefined
        },
        bridge: {
          postMessage: false,
          targetOrigin: '*'
        },
        ctas: {
          'solagree-consult': {
            href: '/book-a-solagree-consult'
          }
        }
      }
    }
  },
  devServer: {
    host: 'solagree.local',
    port: 3003
  }
})
