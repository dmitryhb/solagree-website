import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { computed, defineComponent, h } from 'vue'
import ErrorPageContent from '../app/components/ErrorPageContent.vue'
import ErrorPage from '../app/error.vue'

const seoMetaCalls: Array<Record<string, unknown>> = []
const clearErrorCalls: Array<{ redirect?: string }> = []

Object.assign(globalThis, {
  clearError: (options: { redirect?: string }) => {
    clearErrorCalls.push(options)
  },
  computed,
  useSeoMeta: (input: Record<string, unknown>) => {
    seoMetaCalls.push(input)
  }
})

const ErrorPageContentProbe = defineComponent({
  name: 'ErrorPageContentProbe',
  props: {
    eyebrow: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: [String, Number], default: '404' }
  },
  setup(props: { eyebrow: string, title: string, description: string, code: string | number }) {
    return () => h(
      'div',
      {
        class: 'error-page-content-probe',
        'data-eyebrow': props.eyebrow,
        'data-title': props.title,
        'data-description': props.description,
        'data-code': String(props.code)
      },
      `${props.eyebrow} ${props.title} ${props.code}`
    )
  }
})

const stubs = {
  UApp: { template: '<div><slot /></div>' },
  SkipLink: { template: '<div />' },
  AppHeader: { template: '<div />' },
  SiteFooter: { template: '<div />' },
  ErrorPageContent: ErrorPageContentProbe
}

enableAutoUnmount(afterEach)

beforeEach(() => {
  seoMetaCalls.length = 0
  clearErrorCalls.length = 0
})

describe('ErrorPageContent', () => {
  const mountErrorPageContent = (props: { eyebrow?: string, title?: string, description?: string, code?: string | number } = {}) =>
    mount(ErrorPageContent, {
      props: {
        eyebrow: props.eyebrow ?? '404',
        title: props.title ?? 'Page not found',
        description: props.description ?? 'The page you are looking for may have moved.',
        ...(props.code !== undefined ? { code: props.code } : {})
      },
      global: {
        directives: {
          appear: {}
        },
        stubs: {
          SiteFooter: { template: '<div />' }
        }
      }
    })

  it('displays the visual 404 mark by default', () => {
    const wrapper = mountErrorPageContent()

    expect(wrapper.get('.error-page__mark span').text()).toBe('404')
  })

  it('displays the actual error code for non-404 errors', () => {
    const wrapper = mountErrorPageContent({ code: '500' })

    expect(wrapper.get('.error-page__mark span').text()).toBe('500')
  })
})

describe('error page route', () => {
  const mountErrorPage = (statusCode: number) =>
    mount(ErrorPage, {
      props: {
        error: {
          statusCode,
          message: 'boom'
        }
      },
      global: { stubs }
    })

  it('passes the actual status code to the error content for 5xx errors', () => {
    const wrapper = mountErrorPage(503)
    const probe = wrapper.get('.error-page-content-probe')

    expect(probe.attributes('data-code')).toBe('503')
    expect(probe.attributes('data-eyebrow')).toBe('503')
    expect(probe.attributes('data-title')).toBe('Something went wrong')
  })

  it('keeps the dedicated 404 presentation for not-found errors', () => {
    const wrapper = mountErrorPage(404)
    const probe = wrapper.get('.error-page-content-probe')

    expect(probe.attributes('data-code')).toBe('404')
    expect(probe.attributes('data-title')).toBe('Page not found')
  })

  it('applies an explicit noindex robots policy to error output', () => {
    mountErrorPage(500)

    expect(seoMetaCalls).toHaveLength(1)
    expect(seoMetaCalls[0]).toMatchObject({ robots: 'noindex, nofollow' })
  })
})
