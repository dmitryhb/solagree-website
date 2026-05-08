<script setup lang="ts">
import { solagreeSocialLinks } from '~/data/social-links'

const currentYear = new Date().getFullYear()
const portalLoginHref = usePortalLoginHref()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <NuxtLink
            to="/"
            class="site-footer__logo-link"
            aria-label="Solagree home"
          >
            <span
              class="site-footer__logo"
              aria-hidden="true"
            />
          </NuxtLink>

          <p class="site-footer__tagline">
            A next-generation divorce platform designed to reduce conflict and cost through binding mediation and arbitration.
          </p>

          <SiteButton
            class="site-footer__cta"
            to="/quiz"
            variant="primary"
            size="sm"
          >
            Is Solagree right for you?
          </SiteButton>
        </div>

        <nav
          class="site-footer__nav"
          aria-label="Footer navigation"
        >
          <div class="site-footer__column">
            <p class="site-footer__column-title">
              For couples
            </p>
            <ul class="site-footer__links">
              <li>
                <NuxtLink to="/">
                  How It Works
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/quiz">
                  Quiz: Will it Work for us?
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Solagree vs Traditional
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Pricing
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/faq">
                  FAQs
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="site-footer__column">
            <p class="site-footer__column-title">
              For professionals
            </p>
            <ul class="site-footer__links">
              <li>
                <NuxtLink to="/attorneys">
                  Attorneys
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Financial Advisors
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Counselors
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Employers/EAP
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/attorney-application">
                  Join the Network
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="site-footer__column">
            <p class="site-footer__column-title">
              Company
            </p>
            <ul class="site-footer__links">
              <li>
                <NuxtLink to="/">
                  About Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/faq">
                  FAQ
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact">
                  Contact Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/">
                  Learn
                </NuxtLink>
              </li>
              <li>
                <a :href="portalLoginHref">
                  Account Login
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <div class="site-footer__legal-group">
          <ul
            class="site-footer__social-links"
            aria-label="Social links"
          >
            <li
              v-for="link in solagreeSocialLinks"
              :key="link.label"
            >
              <a
                class="site-footer__social-link"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.ariaLabel"
              >
                <span
                  class="site-footer__social-icon"
                  :class="`site-footer__social-icon--${link.icon}`"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>

          <ul class="site-footer__legal-links">
            <li>
              <NuxtLink to="/legal/terms-of-service">
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/legal/privacy-policy">
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/legal/accessibility">
                Accessibility
              </NuxtLink>
            </li>
          </ul>

          <p class="site-footer__copyright">
            © {{ currentYear }} Solagree, LLC. All Rights Reserved.
          </p>
        </div>

        <p class="site-footer__disclaimer">
          Solagree® is not a law firm and does not provide legal advice. We connect clients with independent professionals.
        </p>
      </div>
    </div>
  </footer>
</template>
