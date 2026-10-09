import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WebinarVideoFrame from '../app/components/webinar/WebinarVideoFrame.vue'

describe('video referrer policy', () => {
  it('identifies the website origin for marketing video privacy rules', () => {
    const wrapper = mount(WebinarVideoFrame)
    expect(wrapper.get('iframe').attributes('referrerpolicy')).toBe('strict-origin-when-cross-origin')
  })

  it('suppresses the referrer when explicitly requested for gated recordings', () => {
    const wrapper = mount(WebinarVideoFrame, { props: { referrerPolicy: 'no-referrer' } })
    expect(wrapper.get('iframe').attributes('referrerpolicy')).toBe('no-referrer')
    const page = readFileSync(resolve(process.cwd(), 'app/pages/webinars/[id].vue'), 'utf8')
    expect(page).toMatch(/<WebinarVideoFrame\s+referrer-policy="no-referrer"/)
  })
})
