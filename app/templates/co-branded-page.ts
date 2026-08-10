import Handlebars from 'handlebars'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import { resolveCoBrandedPageTemplateId } from '#shared/co-branded-page-variant'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'
import { attorneyCoBrandedPageTemplateSource } from '~/templates/co-branded-page/attorney'
import { cdfaCoBrandedPageTemplateSource } from '~/templates/co-branded-page/cdfa'

interface CoBrandedPageTemplateContext extends CoBrandedPagePublicConfig {
  isEmbed: boolean
  attorneyDisplayName: string
  attorneyDisplayNameWithPeriod: string
  currentYear: number
}

const attorneyCoBrandedPageTemplate = Handlebars.compile<CoBrandedPageTemplateContext>(attorneyCoBrandedPageTemplateSource)
const cdfaCoBrandedPageTemplate = Handlebars.compile<CoBrandedPageTemplateContext>(cdfaCoBrandedPageTemplateSource)

const templateRegistry = {
  'solagree-basic-v1': attorneyCoBrandedPageTemplate,
  'cdfa-basic-v1': cdfaCoBrandedPageTemplate
} as const

/**
 * Renders the configured co-branded template with Handlebars escaping.
 */
export const renderCoBrandedPageTemplate = (
  config: CoBrandedPagePublicConfig,
  mode: CoBrandedPageRenderMode
): string => {
  const template = templateRegistry[resolveCoBrandedPageTemplateId(config.templateId, config.pageType)]

  return template({
    ...config,
    isEmbed: mode === 'embed',
    attorneyDisplayName: config.attorneyName ?? config.companyName,
    attorneyDisplayNameWithPeriod: `${config.attorneyName ?? config.companyName}`.replace(/\.*$/, '.'),
    currentYear: new Date().getFullYear()
  })
}
