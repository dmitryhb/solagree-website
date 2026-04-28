import Handlebars from 'handlebars'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

interface CoBrandedPageTemplateContext extends CoBrandedPagePublicConfig {
  isEmbed: boolean
  contactLine: string
}

const solagreeBasicTemplate = Handlebars.compile<CoBrandedPageTemplateContext>(`
  <article class="co-branded-page co-branded-page--{{#if isEmbed}}embed{{else}}standard{{/if}}">
    <header class="co-branded-page__brand-row">
      <img class="co-branded-page__solagree-logo" src="/solagree-logo.svg" alt="Solagree">
      {{#if logoUrl}}
        <span class="co-branded-page__brand-divider" aria-hidden="true"></span>
        <img class="co-branded-page__partner-logo" src="{{logoUrl}}" alt="{{companyName}}">
      {{/if}}
    </header>

    <section class="co-branded-page__intro" aria-label="Co-branded page introduction">
      <p class="co-branded-page__eyebrow">In partnership with {{companyName}}</p>
      <h1>A clearer divorce plan starts here.</h1>
      <p>
        Solagree helps families understand their path, organize next steps, and prepare for a focused consult.
      </p>
      <div class="co-branded-page__actions">
        <a class="co-branded-page__primary-cta" href="{{ctaUrl}}">Start the quiz</a>
        {{#if contactLine}}
          <span class="co-branded-page__contact">{{contactLine}}</span>
        {{/if}}
      </div>
    </section>

    <section class="co-branded-page__benefits" aria-labelledby="co-branded-benefits-title">
      <h2 id="co-branded-benefits-title">What you get with Solagree</h2>
      <div class="co-branded-page__benefits-grid">
        <article class="co-branded-page__benefit-card">
          <span class="co-branded-page__benefit-icon co-branded-page__benefit-icon--resolution" aria-hidden="true"></span>
          <h3>Foster Resolution</h3>
          <p>Typically resolves in months - completely virtual, and no courtroom appearances.</p>
        </article>
        <article class="co-branded-page__benefit-card">
          <span class="co-branded-page__benefit-icon co-branded-page__benefit-icon--pricing" aria-hidden="true"></span>
          <h3>Flat-Fee Pricing</h3>
          <p>Know your costs upfront with predictable flat fees - no hourly billing surprises.</p>
        </article>
        <article class="co-branded-page__benefit-card">
          <span class="co-branded-page__benefit-icon co-branded-page__benefit-icon--commitment" aria-hidden="true"></span>
          <h3>Binding Commitment</h3>
          <p>Both parties commit to resolving from day one - no one walks away.</p>
        </article>
      </div>
    </section>

    <section class="co-branded-page__process" aria-labelledby="co-branded-process-title">
      <div class="co-branded-page__process-intro">
        <h2 id="co-branded-process-title">How It Works</h2>
        <p>Three phases. One resolution. A structured process designed for couples who can't agree on everything.</p>
        <a class="co-branded-page__secondary-cta" href="{{ctaUrl}}">Is Solagree Right for You?</a>
      </div>
      <div class="co-branded-page__phases">
        <article>
          <h3>Phase 1: Assessment</h3>
          <p>Your CCFA helps you organize finances and documents where you already agree.</p>
        </article>
        <article>
          <h3>Phase 2: Mediation</h3>
          <p>A skilled mediator guides structured negotiations on custody, finances, and support.</p>
        </article>
        <article>
          <h3>Phase 3: Arbitration</h3>
          <p>Your arbitrator creates a binding agreement. What you've agreed on is adopted; what you haven't is decided for you.</p>
        </article>
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
