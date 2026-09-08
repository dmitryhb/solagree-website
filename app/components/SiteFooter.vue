<script setup lang="ts">
import { useModalDialog } from '~/composables/useModalDialog'
import { resourceNavigationLinks } from '~/data/resource-navigation'
import { solagreeSocialLinks } from '~/data/social-links'

const currentYear = new Date().getFullYear()
const portalLoginHref = usePortalLoginHref()
const isNetworkChooserOpen = ref(false)
const networkChooserDialog = ref<HTMLElement | null>(null)
const networkChooserTrigger = ref<HTMLButtonElement | null>(null)

const closeNetworkChooser = () => {
  if (!isNetworkChooserOpen.value) {
    return
  }

  isNetworkChooserOpen.value = false
  void networkChooserDialogBehavior.deactivate()
}

const networkChooserDialogBehavior = useModalDialog({
  getContainer: () => networkChooserDialog.value,
  getInitialFocusTarget: () => networkChooserDialog.value,
  getRestoreFocusTarget: () => networkChooserTrigger.value,
  onRequestClose: closeNetworkChooser
})

const openNetworkChooser = () => {
  if (isNetworkChooserOpen.value) {
    return
  }

  isNetworkChooserOpen.value = true
  void networkChooserDialogBehavior.activate()
}
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
                <NuxtLink to="/#how-it-works">
                  How It Works
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/quiz">
                  Quiz: Will it Work for us?
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/#pricing">
                  Pricing
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/military-divorce">Military</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/divorce-special-needs-children">Special Needs</NuxtLink>
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
                <NuxtLink to="/cdfa">
                  CDFAs® & Advisors
                </NuxtLink>
              </li>
              <li>
                <button
                  ref="networkChooserTrigger"
                  class="site-footer__link-button"
                  type="button"
                  aria-haspopup="dialog"
                  :aria-expanded="isNetworkChooserOpen"
                  @click="openNetworkChooser"
                >
                  Join the Network
                </button>
              </li>
            </ul>
          </div>

          <div class="site-footer__column">
            <p class="site-footer__column-title">
              Resources
            </p>
            <ul class="site-footer__links">
              <li
                v-for="link in resourceNavigationLinks"
                :key="link.label"
              >
                <NuxtLink :to="link.to">
                  {{ link.label }}
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
                <NuxtLink to="/about-us">
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

    <Teleport to="body">
      <Transition name="site-footer-network-chooser">
        <div
          v-if="isNetworkChooserOpen"
          class="network-chooser"
          role="presentation"
          @keydown="networkChooserDialogBehavior.handleKeydown"
        >
          <button
            class="network-chooser__backdrop"
            type="button"
            aria-label="Close network chooser"
            @click="closeNetworkChooser"
          />

          <section
            class="network-chooser__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-chooser-title"
            tabindex="-1"
            ref="networkChooserDialog"
          >
            <button
              class="network-chooser__close"
              type="button"
              aria-label="Close network chooser"
              @click="closeNetworkChooser"
            >
              <span aria-hidden="true" />
            </button>

            <p class="network-chooser__eyebrow">
              Join the Network
            </p>
            <h2
              id="network-chooser-title"
              class="network-chooser__title"
            >
              Choose your application
            </h2>
            <p class="network-chooser__intro">
              Select the professional track that matches your practice.
            </p>

            <div class="network-chooser__actions">
              <NuxtLink
                class="network-chooser__option"
                to="/attorney-application"
                @click="closeNetworkChooser"
              >
                <span class="network-chooser__option-title">Attorney Application</span>
                <span class="network-chooser__option-copy">For attorneys and legal professionals.</span>
              </NuxtLink>

              <NuxtLink
                class="network-chooser__option network-chooser__option--accent"
                to="/cdfa-application"
                @click="closeNetworkChooser"
              >
                <span class="network-chooser__option-title">CDFA Application</span>
                <span class="network-chooser__option-copy">For CDFAs and financial advisors.</span>
              </NuxtLink>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </footer>
</template>
