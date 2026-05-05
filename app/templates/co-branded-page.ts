import Handlebars from 'handlebars'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

interface CoBrandedPageTemplateContext extends CoBrandedPagePublicConfig {
  isEmbed: boolean
  attorneyDisplayName: string
  attorneyDisplayNameWithPeriod: string
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

    <section class="co-branded-page__feature-strip" aria-label="Solagree benefits">
      <ul>
        <li>Resolve Faster</li>
        <li>Flat-Fee Pricing</li>
        <li>Entirely Virtual</li>
        <li>Binding Process</li>
      </ul>
    </section>

    <section class="co-branded-page__what-is" aria-labelledby="co-branded-what-is-title">
      <div class="co-branded-page__what-is-heading">
        <h2 id="co-branded-what-is-title">What is Solagree?</h2>
        <p>
          A flat-fee, virtual alternative to traditional divorce litigation with a structured path to resolution &ndash;
          even when you don't agree on everything.
        </p>
      </div>

      <div class="co-branded-page__what-is-grid">
        <img
          class="co-branded-page__what-is-image"
          src="/images/co-branded-who-its-for.webp"
          alt="Family smiling while looking at a phone together"
        >

        <div class="co-branded-page__what-is-card">
          <h3>Who It&rsquo;s For:</h3>
          <ul>
            <li>Couples who want to avoid lengthy and costly court battles</li>
            <li>Cases from moderate to complex (financial and/or parenting issues)</li>
            <li>Both parties willing to participate in good faith even if they don&rsquo;t agree</li>
          </ul>
          <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Schedule a Free Consultation</a>
        </div>
      </div>
    </section>

    <section class="co-branded-page__how-it-works" aria-labelledby="co-branded-how-it-works-title">
      <h2 id="co-branded-how-it-works-title">How It Works</h2>

      <div class="co-branded-page__how-steps">
        <article class="co-branded-page__how-step co-branded-page__how-step--organized">
          <img
            class="co-branded-page__how-step-icon"
            src="/images/co-branded-icon-get-organized.webp"
            alt=""
            aria-hidden="true"
          >
          <span class="co-branded-page__how-step-number">01</span>
          <h3>Get Organized</h3>
          <p>Experts help organize your financial and parenting information.</p>
        </article>

        <article class="co-branded-page__how-step co-branded-page__how-step--agreement">
          <img
            class="co-branded-page__how-step-icon"
            src="/images/co-branded-icon-reach-agreement.webp"
            alt=""
            aria-hidden="true"
          >
          <span class="co-branded-page__how-step-number">02</span>
          <h3>Reach Agreement</h3>
          <p>Virtual mediation to resolve parenting and financial issues.</p>
        </article>

        <article class="co-branded-page__how-step co-branded-page__how-step--resolution">
          <img
            class="co-branded-page__how-step-icon"
            src="/images/co-branded-icon-binding-resolution.webp"
            alt=""
            aria-hidden="true"
          >
          <span class="co-branded-page__how-step-number">03</span>
          <h3>Binding Resolution</h3>
          <p>Secure a binding decision on any remaining unresolved matters.</p>
        </article>

        <article class="co-branded-page__how-step co-branded-page__how-step--finalize">
          <img
            class="co-branded-page__how-step-icon"
            src="/images/co-branded-icon-finalize-file.webp"
            alt=""
            aria-hidden="true"
          >
          <span class="co-branded-page__how-step-number">04</span>
          <h3>Finalize &amp; File</h3>
          <p>Documents prepared and filed (typically no court appearance needed.)</p>
        </article>
      </div>
    </section>

    <section class="co-branded-page__attorney-guide" aria-labelledby="co-branded-attorney-guide-title">
      <img
        class="co-branded-page__attorney-guide-image"
        src="/images/co-branded-attorney-guides.webp"
        alt="Attorney reviewing documents at a laptop"
      >

      <div class="co-branded-page__attorney-guide-content">
        <h2 id="co-branded-attorney-guide-title">How Your Attorney Guides You</h2>
        <p class="co-branded-page__attorney-guide-lede">
          Your attorney works alongside the Solagree process at every phase:
        </p>

        <ul class="co-branded-page__attorney-guide-list">
          <li><strong>Before you start</strong> - ensures you understand the process and answers your initial questions</li>
          <li><strong>Before mediation</strong> - reviews expert summaries, identifies issues, and helps you prepare your strategy</li>
          <li><strong>Before arbitration</strong> - helps you present your position effectively and advises on what matters most</li>
          <li><strong>After resolution</strong> - reviews the final award, walks you through the outcome, and handles all court filing</li>
        </ul>

        <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light co-branded-page__primary-cta--arrow" href="{{ctaUrl}}">
          Schedule a Free Consultation
          <img class="button-arrow-icon" src="/icons/arrow.svg" alt="">
        </a>
      </div>
    </section>

    <section class="co-branded-page__tracks" aria-labelledby="co-branded-tracks-title">
      <h2 id="co-branded-tracks-title">Choose Your Track</h2>
      <p class="co-branded-page__tracks-intro">
        Solagree's platform fees include the core process: neutral experts, mediation, arbitration, and final award.
      </p>

      <div class="co-branded-page__tracks-grid">
        <article class="co-branded-page__track-card">
          <header class="co-branded-page__track-header">
            <h3>Parenting Track</h3>
          </header>

          <div class="co-branded-page__track-price">
            <span class="co-branded-page__track-amount">$2,250</span>
            <span class="co-branded-page__track-cadence">/ per person</span>
          </div>

          <p class="co-branded-page__track-description">
            Guided by parenting specialists and neutral mediators who help you create a sustainable parenting plan.
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">For cases involving</p>
            <ul class="co-branded-page__track-features">
              <li>Custody and parenting time schedules</li>
              <li>Decision-making responsibilities</li>
              <li>Holiday and vacation planning</li>
              <li>Co-parenting communication plans</li>
            </ul>
          </div>

          <p class="co-branded-page__track-note">Best for couples focused on children under 18</p>
        </article>

        <article class="co-branded-page__track-card">
          <header class="co-branded-page__track-header">
            <h3>Financial Track</h3>
            <span class="co-branded-page__track-badge">Popular</span>
          </header>

          <div class="co-branded-page__track-price">
            <span class="co-branded-page__track-amount">$4,800</span>
            <span class="co-branded-page__track-cadence">/ per person</span>
          </div>

          <p class="co-branded-page__track-description">
            Guided by CDFA® financial experts and neutral mediators who help you navigate complex financial decisions.
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">For cases involving</p>
            <ul class="co-branded-page__track-features">
              <li>Property division and asset distribution</li>
              <li>Business ownership and valuation</li>
              <li>Retirement accounts and pensions</li>
              <li>Spousal support calculations</li>
            </ul>
          </div>

          <p class="co-branded-page__track-note">Best for couples with assets to divide</p>
        </article>

        <article class="co-branded-page__track-card co-branded-page__track-card--featured">
          <header class="co-branded-page__track-header">
            <h3>Parenting + Financial</h3>
          </header>

          <p class="co-branded-page__track-eyebrow">Save over $1,000 each</p>
          <div class="co-branded-page__track-price">
            <span class="co-branded-page__track-amount">$5,990</span>
            <span class="co-branded-page__track-cadence">/ per person</span>
          </div>

          <p class="co-branded-page__track-description">
            Combines expert parenting and CDFA® financial guidance in one comprehensive process - with neutral mediation and arbitration.
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">For cases involving</p>
            <ul class="co-branded-page__track-features">
              <li>Child custody, schedules, and co-parenting</li>
              <li>Property division and asset distribution</li>
              <li>Businesses, pensions, retirement accounts</li>
              <li>Spousal support calculations</li>
            </ul>
          </div>

          <p class="co-branded-page__track-note">For couples with both parenting and financial concerns</p>
        </article>
      </div>

      <p class="co-branded-page__tracks-note">
        Your attorney continues to provide strategic guidance throughout the Solagree process.<br>
        Discuss their fee structure directly with {{attorneyDisplayNameWithPeriod}}
      </p>
    </section>

    <section class="co-branded-page__questions" aria-labelledby="co-branded-questions-title">
      <div class="co-branded-page__questions-copy">
        <h2 id="co-branded-questions-title">Common Questions</h2>
        <div class="co-branded-page__questions-intro">
          <p>
            Solagree offers a structured alternative to traditional divorce litigation - combining expert financial guidance, mediation, and binding arbitration.
          </p>
          <p>
            Our process is designed for couples who can't agree on everything but want to avoid lengthy court battles and reach resolution efficiently.
          </p>
        </div>
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
    attorneyDisplayName: config.attorneyName ?? config.companyName,
    attorneyDisplayNameWithPeriod: `${config.attorneyName ?? config.companyName}`.replace(/\.*$/, '.'),
    currentYear: new Date().getFullYear()
  })
}
