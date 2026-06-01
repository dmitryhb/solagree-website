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
      {{#unless isEmbed}}
        {{#if logoUrl}}
          <img class="co-branded-page__partner-logo" src="{{logoUrl}}" alt="{{companyName}}">
        {{/if}}
      {{/unless}}
      <img class="co-branded-page__solagree-logo" src="/solagree-logo.svg" alt="Solagree">
    </header>

    <section class="co-branded-page__hero" aria-labelledby="co-branded-hero-title">
      <div class="co-branded-page__hero-content">
        <p class="co-branded-page__hero-eyebrow">A Better Way Forward</p>
        <h1 id="co-branded-hero-title">
          <span>A Structured Path to</span>
          <span>Divorce Resolution</span>
        </h1>
        <p class="co-branded-page__hero-copy">
          We partner with Solagree to give you a virtual alternative to court litigation – with predictable platform fees and expert guidance at every phase.
        </p>
        <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light co-branded-page__primary-cta--arrow co-branded-page__hero-cta" href="{{ctaUrl}}">
          Request a Consultation
          <img class="button-arrow-icon" src="/icons/arrow.svg" alt="">
        </a>
      </div>

      <img
        class="co-branded-page__hero-image"
        src="/images/co-branded-hero.webp"
        alt="A professional woman with dark hair, a pink turtleneck, and a grey blazer sitting at a white desk with a keyboard, speaking and gesturing warmly during a video consultation."
      >
    </section>

    <section class="co-branded-page__feature-strip" aria-label="Solagree benefits">
      <ul>
        <li>Resolve Faster</li>
        <li>Predictable Pricing</li>
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
          alt="A smiling father with a graying beard sits on a white couch alongside his two sons, all laughing together while looking at a smartphone held by the younger boy."
        >

        <div class="co-branded-page__what-is-card">
          <h3>Who It&rsquo;s For:</h3>
          <ul>
            <li>Couples who want to avoid lengthy and costly court battles</li>
            <li>Cases from moderate to complex (financial and/or parenting issues)</li>
            <li>Both parties willing to participate in good faith even if they don&rsquo;t agree</li>
          </ul>
          <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Request a Consultation</a>
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
        alt="An East Asian professional woman wearing glasses and a grey blazer sits at a conference table, holding a white document in one hand while using a pen to navigate her open silver laptop."
      >

      <div class="co-branded-page__attorney-guide-content">
        <h2 id="co-branded-attorney-guide-title">How We Guide You</h2>
        <p class="co-branded-page__attorney-guide-lede">
          We work alongside the Solagree process at every phase:
        </p>

        <ul class="co-branded-page__attorney-guide-list">
          <li><strong>Before you start</strong> - Ensuring you understand the process and answering your questions</li>
          <li><strong>Before mediation</strong> - Reviewing expert summaries and helping prepare your strategy</li>
          <li><strong>Before arbitration</strong> - Helping you present your position and advising on what matters most</li>
          <li><strong>After resolution</strong> - Reviewing the final award and handling all court filing</li>
        </ul>

        <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light co-branded-page__primary-cta--arrow" href="{{ctaUrl}}">
          Request a Consultation
          <img class="button-arrow-icon" src="/icons/arrow.svg" alt="">
        </a>
      </div>
    </section>

    <section class="co-branded-page__tracks" aria-labelledby="co-branded-tracks-title">
      <h2 id="co-branded-tracks-title">Two Paths to Resolution</h2>
      <p class="co-branded-page__tracks-intro">
        Both paths include neutral experts, mediation, and binding arbitration.<br>
        We'll recommend the right fit for your case.
      </p>

      <div class="co-branded-page__tracks-grid">
        <article class="co-branded-page__track-card">
          <h3>SOLAGREE &ndash; CORE</h3>
          <p class="co-branded-page__track-description">
            A streamlined path with predictable attorney fees, designed for standard cases that can move efficiently to resolution.
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">For cases involving</p>
            <ul class="co-branded-page__track-features">
              <li>Standard financial matters</li>
              <li>Cooperative parenting plans</li>
              <li>Lower-conflict situations</li>
              <li>Flat-fee attorney structure</li>
            </ul>
          </div>

          <p class="co-branded-page__track-note">Best for couples ready to move efficiently through the process.</p>
        </article>

        <article class="co-branded-page__track-card">
          <h3>SOLAGREE &ndash; COMPASS</h3>
          <p class="co-branded-page__track-description">
            An extended path with hourly attorney support, designed for complex cases requiring additional time and expertise.
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">For cases involving</p>
            <ul class="co-branded-page__track-features">
              <li>Complex financial or business assets</li>
              <li>Challenging custody or co-parenting needs</li>
              <li>Higher-conflict situations</li>
              <li>Hourly attorney support</li>
            </ul>
          </div>

          <p class="co-branded-page__track-note">Best for cases requiring extended support and specialized expertise.</p>
        </article>
      </div>

      <div class="co-branded-page__tracks-note">
        <p><strong>We continue to provide strategic guidance throughout the Solagree process.</strong></p>
        <p>Solagree platform fees are separate from attorney fees. We'll discuss both during your consultation.</p>
      </div>
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
        <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Request a Consultation</a>
      </div>

      <div class="co-branded-page__questions-accordion">
        <details class="co-branded-page__accordion-item" open>
          <summary>
            <span>How do I get my spouse to agree to Solagree?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <div class="co-branded-page__accordion-content">
            <p>Here are a few approaches:</p>
            <ul>
              <li>Share this page so they can explore Solagree on their own</li>
              <li>Focus on the benefits - faster resolution, less conflict, predictable costs</li>
              <li>Connect them with their own advisor - We can help both spouses find appropriate professional support</li>
              <li>Schedule a consultation to discuss the best strategy for your situation, and we'll help you navigate next steps.</li>
            </ul>
          </div>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>Do we need attorneys?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            While not required, we recommend both parties work with independent attorneys who can provide legal guidance throughout the process. We can refer you to network attorneys who work with Solagree.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>Is the arbitration binding?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            Yes, in most states. The arbitration award becomes a legally binding resolution that can be filed with the court without appearing.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>Are payment plans available?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            Yes. Payment plan options are available. Schedule a consultation to discuss the best payment structure for your situation.
          </p>
        </details>

        <details class="co-branded-page__accordion-item">
          <summary>
            <span>What happens after the Solagree process?</span>
            <span class="co-branded-page__accordion-icon" aria-hidden="true"></span>
          </summary>
          <p>
            The final agreement or arbitration award is filed with the court to make it legally binding. In most cases, no courtroom appearance is required. Your financial advisor can help you implement your post-divorce financial plan.
          </p>
        </details>
      </div>
    </section>

    <section class="co-branded-page__next-steps" aria-labelledby="co-branded-next-steps-title">
      <div class="co-branded-page__section-heading">
        <h2 id="co-branded-next-steps-title">Your Next Steps</h2>
        <p>
          The first step is a conversation. We'll discuss your situation and help you understand the right path forward.
        </p>
      </div>

      <div class="co-branded-page__next-steps-grid">
        <div class="co-branded-page__next-steps-card">
          <h3>Let's Talk About Your Situation</h3>
          <p>Request a consultation to learn more about Solagree and discuss whether it's the right approach for your case.</p>
          <a class="co-branded-page__primary-cta co-branded-page__primary-cta--light" href="{{ctaUrl}}">Request a Consultation</a>
        </div>

        <img
          class="co-branded-page__next-steps-image"
          src="/images/co-branded-next-steps.webp"
          alt="A close-up view of a blonde woman wearing a crisp white button-down shirt, holding a black smartphone to her ear while listening intently during a call."
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
