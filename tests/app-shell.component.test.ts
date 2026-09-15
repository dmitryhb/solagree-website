import { mount } from '@vue/test-utils'
import { computed, nextTick, onScopeDispose, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../app/app.vue'

type AppShell = 'home' | 'internal' | 'bare'

interface TestRoute {
  meta: { appShell?: AppShell }
  path: string
}

const createRoute = (path: string, appShell?: AppShell): TestRoute => ({
  meta: { appShell },
  path
})

const currentRoute = ref(createRoute('/about-us'))

Object.assign(globalThis, {
  computed,
  nextTick,
  useRouter: () => ({
    afterEach: (callback: typeof routeCommitted) => {
      routeCommitted = callback

      return () => {}
    },
    currentRoute
  }),
  onScopeDispose
})

let routeCommitted: (
  route: TestRoute,
  from?: TestRoute,
  failure?: Error
) => void

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

const settleRouteChange = async () => {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  currentRoute.value = createRoute('/about-us')
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
    currentRoute.value = createRoute(path, appShell)

    expectShell(mountApp(), appShell)
  })

  it('updates shell chrome from route metadata during SPA navigation', async () => {
    const wrapper = mountApp()

    expectShell(wrapper, 'internal')

    currentRoute.value = createRoute('/quiz/embed', 'bare')
    routeCommitted(currentRoute.value)
    await settleRouteChange()
    expectShell(wrapper, 'bare')

    currentRoute.value = createRoute('/review/quiz', 'internal')
    routeCommitted(currentRoute.value)
    await settleRouteChange()
    expectShell(wrapper, 'internal')
  })

  it('ignores shell metadata from a cancelled navigation', async () => {
    const wrapper = mountApp()

    routeCommitted(createRoute('/quiz', 'bare'), currentRoute.value, new Error('cancelled'))
    await settleRouteChange()

    expectShell(wrapper, 'internal')
  })
})
