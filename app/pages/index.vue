<script setup lang="ts">
import { solagreeSocialLinks } from '~/data/social-links'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl.replace(/\/+$/, '')

useSolagreeSeo({
  title: 'Virtual Flat-Fee Divorce Without Court',
  description:
    'Solagree helps couples resolve divorce online with a structured, flat-fee process designed to reduce conflict, cost, and court involvement.',
  path: '/',
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Solagree',
      url: siteUrl,
      logo: `${siteUrl}/solagree-logo.svg`,
      sameAs: solagreeSocialLinks.map(link => link.href)
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Solagree',
      url: siteUrl
    }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-[var(--color-surface-footer)]">
    <SplashSection />
    <WhatYouGetSection />
    <HowItWorksSection />
    <GetStartedSection />
    <KidsSection />
    <ChoosePathSection />
    <HomeQuizSection />
    <PricingSection />
    <CommonQuestionsSection />
    <ForProfessionalsSection />
    <SiteFooter />
  </main>
</template>
