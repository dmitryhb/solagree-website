import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveCoBrandedPageTemplateId } from '../shared/co-branded-page-variant.ts'

const publicRouteCases = [
  { pageType: 'standard', route: '/go/partner', expectedTemplateId: 'solagree-basic-v1', crossTypeTemplateId: 'cdfa-basic-v1' },
  { pageType: 'standard', route: '/go/partner/embed', expectedTemplateId: 'solagree-basic-v1', crossTypeTemplateId: 'cdfa-basic-v1' },
  { pageType: 'cdfa', route: '/cdfa/go/partner', expectedTemplateId: 'cdfa-basic-v1', crossTypeTemplateId: 'solagree-basic-v1' },
  { pageType: 'cdfa', route: '/cdfa/go/partner/embed', expectedTemplateId: 'cdfa-basic-v1', crossTypeTemplateId: 'solagree-basic-v1' }
] as const

test('uses only the route-compatible template for public page and embed routes', () => {
  for (const routeCase of publicRouteCases) {
    assert.equal(resolveCoBrandedPageTemplateId(routeCase.expectedTemplateId, routeCase.pageType), routeCase.expectedTemplateId, routeCase.route)
    assert.equal(resolveCoBrandedPageTemplateId(undefined, routeCase.pageType), routeCase.expectedTemplateId, routeCase.route)
    assert.equal(resolveCoBrandedPageTemplateId('not-a-template', routeCase.pageType), routeCase.expectedTemplateId, routeCase.route)
    assert.equal(resolveCoBrandedPageTemplateId(routeCase.crossTypeTemplateId, routeCase.pageType), routeCase.expectedTemplateId, routeCase.route)
  }
})
