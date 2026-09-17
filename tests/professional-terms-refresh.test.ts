import { describe, expect, it, vi } from 'vitest'
import { refreshTermsAfterVersionConflict } from '../app/utils/professional-terms'

describe('terms refresh after an application version conflict', () => {
  it('refreshes the displayed document and requires a fresh checkbox acknowledgment', async () => {
    const steps: string[] = []
    await refreshTermsAfterVersionConflict(
      { statusCode: 409 },
      async () => { steps.push('refresh') },
      () => { steps.push('clear') }
    )
    expect(steps).toEqual(['refresh', 'clear'])
  })

  it('keeps terms state for unrelated failures', async () => {
    const refresh = vi.fn(async () => {})
    const clear = vi.fn()
    await refreshTermsAfterVersionConflict({ statusCode: 500 }, refresh, clear)
    expect(refresh).not.toHaveBeenCalled()
    expect(clear).not.toHaveBeenCalled()
  })
})
