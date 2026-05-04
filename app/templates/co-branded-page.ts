import Handlebars from 'handlebars'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

interface CoBrandedPageTemplateContext extends CoBrandedPagePublicConfig {
  isEmbed: boolean
  contactLine: string
  currentYear: number
}

const solagreeBasicTemplate = Handlebars.compile<CoBrandedPageTemplateContext>(`
  <article class="co-branded-page co-branded-page--{{#if isEmbed}}embed{{else}}standard{{/if}}">
    <header class="co-branded-page__brand-row">
      <img class="co-branded-page__solagree-logo" src="/solagree-logo.svg" alt="Solagree">
      {{#unless isEmbed}}
        {{#if logoUrl}}
          <span class="co-branded-page__brand-divider" aria-hidden="true"></span>
          <img class="co-branded-page__partner-logo" src="{{logoUrl}}" alt="{{companyName}}">
        {{/if}}
      {{/unless}}
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

    <section class="co-branded-page__questions" aria-labelledby="co-branded-questions-title">
      <div class="co-branded-page__questions-copy">
        <h2 id="co-branded-questions-title">Common Questions</h2>
        <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Schedule a Consultation</a>
      </div>

      <div class="co-branded-page__questions-accordion">
        <details class="co-branded-page__accordion-item" open>
          <summary>
            <span>How does the Solagree consultation work?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            You meet with a Solagree expert to confirm fit, answer process questions, and understand the next steps before moving forward.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>Is Solagree a law firm?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            No. Solagree is not a law firm and does not provide legal advice. We connect clients with independent professionals.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>What happens after I complete the quiz?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            Your answers help identify whether Solagree may fit your situation and guide the best next step for a consultation.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>Can Solagree help if we do not agree on everything?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            Yes. The process is designed for couples who need a structured path through unresolved financial, parenting, or support issues.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>How long does the process take?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            Timing depends on the complexity of your situation, but the process is built to move families toward resolution efficiently.
          </p>
        </details>
      </div>
    </section>

    <section class="co-branded-page__next-steps" aria-labelledby="co-branded-next-steps-title">
      <div class="co-branded-page__section-heading">
        <h2 id="co-branded-next-steps-title">Your Next Steps</h2>
        <p>
          Help couples reach resolution faster while expanding your practice. Join our network of attorneys, CDFAs, and counselors nationwide.
        </p>
      </div>

      <div class="co-branded-page__next-steps-grid">
        <div class="co-branded-page__next-steps-card">
          <h3>Schedule Your Complimentary Solagree Consultation ($60 value)</h3>
          <p>Meet with a Solagree expert to confirm fit, answer questions, and map out the process for you.</p>
          <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Schedule a Consultation</a>
        </div>

        <img
          class="co-branded-page__next-steps-image"
          src="/images/co-branded-next-steps.webp"
          alt="Woman speaking by phone"
        >
      </div>
    </section>

    {{#unless isEmbed}}
      <footer class="co-branded-page__footer">
        <div class="co-branded-page__footer-inner">
          <div class="co-branded-page__footer-contact">
            {{#if attorneyName}}
              <strong>{{attorneyName}}</strong>
            {{/if}}
            {{#if firmName}}
              <span>{{firmName}}</span>
            {{else}}
              <span>{{companyName}}</span>
            {{/if}}
            <div class="co-branded-page__footer-contact-lines">
              {{#if phoneNumber}}
                <span>Phone: {{phoneNumber}}</span>
              {{/if}}
              {{#if emailAddress}}
                <span>Email: {{emailAddress}}</span>
              {{/if}}
            </div>
          </div>

          <div class="co-branded-page__footer-solagree">
            <span class="co-branded-page__footer-logo" aria-label="Solagree"></span>
            <a href="https://solagree.com" target="_blank" rel="noopener noreferrer">Learn more: solagree.com</a>
          </div>
        </div>

        <div class="co-branded-page__footer-bottom">
          <nav class="co-branded-page__footer-legal" aria-label="Legal links">
            <a href="/legal/terms-of-service">Terms of Service</a>
            <a href="/legal/privacy-policy">Privacy Policy</a>
            <a href="/legal/accessibility">Accessibility</a>
          </nav>
          <p>© {{currentYear}} Solagree, LLC. All Rights Reserved.</p>
          <p>Solagree® is not a law firm and does not provide legal advice. We connect clients with independent professionals.</p>
        </div>
      </footer>
    {{/unless}}
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
    contactLine: config.phoneNumber ? `Questions? Call ${config.phoneNumber}` : '',
    currentYear: new Date().getFullYear()
  })
}
