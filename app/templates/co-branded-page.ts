import Handlebars from 'handlebars'
import type { CoBrandedPagePublicConfig, CoBrandedPageRenderMode } from '~/types/co-branded-page'

interface CoBrandedPageTemplateContext extends CoBrandedPagePublicConfig {
  isEmbed: boolean
  contactLine: string
}

const solagreeBasicTemplate = Handlebars.compile<CoBrandedPageTemplateContext>(`
  <article class="co-branded-page co-branded-page--{{#if isEmbed}}embed{{else}}standard{{/if}}">
    <header class="co-branded-page__hero">
      <div class="co-branded-page__brand-row">
        <img class="co-branded-page__solagree-logo" src="/solagree-logo.svg" alt="Solagree">
        {{#if logoUrl}}
          <span class="co-branded-page__brand-divider" aria-hidden="true"></span>
          <img class="co-branded-page__partner-logo" src="{{logoUrl}}" alt="{{companyName}}">
        {{/if}}
      </div>
      <p class="co-branded-page__eyebrow">In partnership with {{companyName}}</p>
      <h1 class="co-branded-page__title">A clearer divorce plan starts here.</h1>
      <p class="co-branded-page__intro">
        Solagree helps families understand their path, organize next steps, and prepare for a focused consult.
      </p>
      <div class="co-branded-page__actions">
        <a class="co-branded-page__cta" href="{{ctaUrl}}">Start the quiz</a>
        {{#if contactLine}}
          <span class="co-branded-page__contact">{{contactLine}}</span>
        {{/if}}
      </div>
    </header>

    <section class="co-branded-page__details" aria-label="How Solagree helps">
      <div>
        <h2>Find the right starting point</h2>
        <p>Answer a short set of questions and see which structured divorce path may fit your situation.</p>
      </div>
      <div>
        <h2>Keep your referral connected</h2>
        <p>Your quiz and consult request stay linked to {{companyName}} so the right partner context is available.</p>
      </div>
      <div>
        <h2>Move with less guesswork</h2>
        <p>Use the results to prepare for a more productive Solagree consult.</p>
      </div>
    </section>
  </article>
`)

const templateRegistry = {
  'solagree-basic-v1': solagreeBasicTemplate
} as const

/**
 * Renders the configured co-branded template with Handlebars escaping.
 */
export const renderCoBrandedPageTemplate = (
  config: CoBrandedPagePublicConfig,
  mode: CoBrandedPageRenderMode
): string => {
  const template = templateRegistry[config.templateId] ?? templateRegistry['solagree-basic-v1']

  return template({
    ...config,
    isEmbed: mode === 'embed',
    contactLine: config.phoneNumber ? `Questions? Call ${config.phoneNumber}` : ''
  })
}
