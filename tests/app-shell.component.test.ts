import { mount } from '@vue/test-utils'
import { computed, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../app/app.vue'

const route = reactive({
  meta: {} as { appShell?: 'home' | 'internal' | 'bare' },
  path: '/about-us'
})

Object.assign(globalThis, {
  computed,
  useRoute: () => route
})

const mountApp = () => mount(App, {
  global: {
    stubs: {
      AppHeader: { template: '<header data-test="site-header" />' },
      NuxtPage: { template: '<div data-test="page" />' },
      SkipLink: { template: '<a data-test="skip-link" />' },
      UApp: { template: '<div><slot /></div>' }
    }
  }
})

const expectShell = (wrapper: ReturnType<typeof mountApp>, appShell: 'home' | 'internal' | 'bare') => {
  expect(wrapper.find('[data-test="site-header"]').exists()).toBe(appShell !== 'bare')
  expect(wrapper.find('.app-shell').classes()).toContain('app-shell')
  expect(wrapper.find('.app-shell').classes().includes('app-shell--internal')).toBe(appShell === 'internal')
  expect(wrapper.findAll('#main-content')).toHaveLength(1)
}

afterEach(() => {
  route.meta = {}
  route.path = '/about-us'
})

describe('App route shell metadata', () => {
  it.each([
    ['/quiz', 'bare'],
    ['/quiz/embed', 'bare'],
    ['/partner-tools/case-qualifier-7h3m9k', 'bare'],
    ['/go/rivera-mediation', 'bare'],
    ['/review/quiz', 'internal'],
    ['/about-us', 'internal'],
    ['/', 'home']
  ] as const)('uses %s shell on direct entry', (path, appShell) => {
    route.path = path
    route.meta = { appShell }

    expectShell(mountApp(), appShell)
  })

  it('updates shell chrome from route metadata during SPA navigation', async () => {
    const wrapper = mountApp()

    expectShell(wrapper, 'internal')

    route.path = '/quiz/embed'
    route.meta = { appShell: 'bare' }
    await nextTick()
    expectShell(wrapper, 'bare')

    route.path = '/review/quiz'
    route.meta = { appShell: 'internal' }
    await nextTick()
    expectShell(wrapper, 'internal')
  })
})
