import { computed, createApp, defineComponent, h, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { createRouter, createWebHistory, RouterLink, RouterView } from 'vue-router'
import ConsultRequestForm from '../../../app/components/consult/ConsultRequestForm.vue'
import FormResultMessage from '../../../app/components/FormResultMessage.vue'
import FormSmsOptInField from '../../../app/components/form/SmsOptInField.vue'
import SiteFormSubmit from '../../../app/components/SiteFormSubmit.vue'
import { useApplicationSubmission } from '../../../app/composables/useApplicationSubmission'
import { initialConsultRequestContent } from '../../../app/data/consult-request'

const analyticsCount = ref(0)
const settledCount = ref(0)

const OtherPage = defineComponent({
  setup() {
    const input = ref<HTMLInputElement | null>(null)

    onMounted(() => input.value?.focus())

    return () => h('section', [
      h('h1', 'Another page'),
      h('label', { for: 'new-page-input' }, 'New page notes'),
      h('input', { id: 'new-page-input', ref: input }),
      h(RouterLink, { to: '/consult' }, () => 'Open a new form')
    ])
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/consult' },
    { path: '/consult', component: ConsultRequestForm, props: { content: initialConsultRequestContent } },
    { path: '/other', component: OtherPage },
    {
      path: initialConsultRequestContent.thankYouPath,
      component: { render: () => h('h1', 'Consult request received') }
    }
  ]
})

Object.assign(globalThis, {
  computed,
  nextTick,
  reactive,
  ref,
  watch,
  useApplicationSubmission,
  useGoogleAnalytics: () => ({ trackEvent: () => { analyticsCount.value += 1 } }),
  useRoute: () => router.currentRoute.value,
  useRuntimeConfig: () => ({ public: { portalApiBaseUrl: window.location.origin } }),
  useSourceUrl: () => `${window.location.origin}${window.location.pathname}`,
  navigateTo: router.push.bind(router),
  // The production form and service use their normal injectable fetch path.
  // Playwright intercepts this local endpoint before any submission begins.
  $fetch: async (request: string, options: { method: string, body: unknown }) => {
    try {
      const response = await fetch(request, {
        method: options.method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(options.body)
      })
      const data: unknown = await response.json()

      if (!response.ok) {
        throw { data, statusCode: response.status }
      }

      return data
    } finally {
      settledCount.value += 1
    }
  }
})

const app = createApp({
  setup: () => () => h('div', {
    'data-analytics-count': analyticsCount.value,
    'data-settled-count': settledCount.value
  }, [
    h(RouterLink, { to: '/other' }, () => 'Leave form'),
    h('main', { id: 'main-content', tabindex: '-1' }, [h(RouterView)])
  ])
})

app.component('FormResultMessage', FormResultMessage)
app.component('FormSmsOptInField', FormSmsOptInField)
app.component('SiteFormSubmit', SiteFormSubmit)
app.component('NuxtLink', RouterLink)
app.use(router)
await router.isReady()
app.mount('#app')
