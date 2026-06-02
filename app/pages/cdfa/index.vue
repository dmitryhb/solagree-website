<script setup lang="ts">
import AttorneyFaqSection from '~/components/attorney/AttorneyFaqSection.vue'
import AttorneyFitsPracticeSection from '~/components/attorney/AttorneyFitsPracticeSection.vue'
import AttorneyHeroSection from '~/components/attorney/AttorneyHeroSection.vue'
import AttorneyHowItWorksSection from '~/components/attorney/AttorneyHowItWorksSection.vue'
import AttorneyLandingPage from '~/components/attorney/AttorneyLandingPage.vue'
import AttorneyMoreCasesSection from '~/components/attorney/AttorneyMoreCasesSection.vue'
import AttorneyOnePlaceSection from '~/components/attorney/AttorneyOnePlaceSection.vue'
import AttorneyPartnerPathsSection from '~/components/attorney/AttorneyPartnerPathsSection.vue'
import AttorneyValueSection from '~/components/attorney/AttorneyValueSection.vue'
import {
  cdfaFaqContent,
  cdfaFitsPracticeContent,
  cdfaHeroContent,
  cdfaHowItWorksContent,
  cdfaMoreCasesContent,
  cdfaOnePlaceContent,
  cdfaPartnerPathsContent,
  cdfaValueContent
} from '~/data/attorney-landing-content'

useSolagreeSeo({
  title: 'CDFA Partners',
  description:
    'Learn how CDFAs and financial advisors can partner with Solagree to help divorcing couples start with financial clarity.',
  path: '/cdfa',
  image: cdfaHeroContent.image.src
})
</script>

<template>
  <AttorneyLandingPage class="cdfa-landing-page">
    <AttorneyHeroSection :content="cdfaHeroContent" />
    <AttorneyPartnerPathsSection :content="cdfaPartnerPathsContent" />
    <AttorneyHowItWorksSection :content="cdfaHowItWorksContent" />
    <AttorneyValueSection :content="cdfaValueContent" />
    <AttorneyOnePlaceSection :content="cdfaOnePlaceContent" />
    <AttorneyMoreCasesSection :content="cdfaMoreCasesContent" />
    <AttorneyFaqSection :content="cdfaFaqContent" />
    <AttorneyFitsPracticeSection :content="cdfaFitsPracticeContent" />
  </AttorneyLandingPage>
</template>
