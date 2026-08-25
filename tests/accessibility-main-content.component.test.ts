import { mount } from '@vue/test-utils'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { computed } from 'vue'
import { describe, expect, it } from 'vitest'
import { useSolagreeSeo } from '../app/composables/useSolagreeSeo'
import HomePage from '../app/pages/index.vue'

const appDirectory = resolve(process.cwd(), 'app')

const collectVueFiles = (directory: string): string[] => {
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = join(directory, entry)

    if (statSync(entryPath).isDirectory()) {
      return collectVueFiles(entryPath)
    }

    return entryPath.endsWith('.vue') ? [entryPath] : []
  })
}

Object.assign(globalThis, {
  computed,
  useHead: () => {},
  useRoute: () => ({ path: '/' }),
  useRuntimeConfig: () => ({
    public: {
      siteUrl: 'https://www.solagree.com'
    }
  }),
  useSeoMeta: () => {},
  useSolagreeSeo
})

const homeSectionStubs = [
  'SplashSection',
  'WhatYouGetSection',
  'HowItWorksSection',
  'GetStartedSection',
  'KidsSection',
  'HomeQuizSection',
  'PricingSection',
  'CommonQuestionsSection',
  'ForProfessionalsSection',
  'SiteFooter'
].reduce<Record<string, boolean>>((stubs, name) => {
  stubs[name] = true

  return stubs
}, {})

describe('Single main-content landmark (HIR-369)', () => {
  it('declares id="main-content" exactly once, in the app shells that own it', () => {
    const declaringFiles = collectVueFiles(appDirectory)
      .map(filePath => ({
        filePath,
        occurrences: readFileSync(filePath, 'utf8')
          .split('id="main-content"')
          .length - 1
      }))
      .filter(file => file.occurrences > 0)
      .map(file => file.filePath)

    expect(declaringFiles).toEqual([
      join(appDirectory, 'app.vue'),
      join(appDirectory, 'error.vue')
    ])

    for (const filePath of declaringFiles) {
      expect(readFileSync(filePath, 'utf8').split('id="main-content"').length - 1).toBe(1)
    }
  })

  it('renders the home page without competing with the app.vue anchor', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: homeSectionStubs
      }
    })

    expect(wrapper.findAll('#main-content')).toHaveLength(0)

    // The home sections still render inside the page for the app shell anchor.
    expect(wrapper.find('main').exists()).toBe(true)
  })
})
