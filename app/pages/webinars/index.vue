<script setup lang="ts">
import { formatWebinarDate, getPublicWebinars, getWebinarLiveRegistrationUrl } from '~/services/webinar-catalog-api'
import { websitePortalFetcher } from '~/services/portal-api'

const config = useRuntimeConfig()
const { data: webinars, status, error, refresh } = await useAsyncData('public-webinars', () =>
  getPublicWebinars(config.public.portalApiBaseUrl, websitePortalFetcher), { server: false })

useSolagreeSeo({ title: 'Webinars & Events', description: 'Explore live events and on-demand webinars from Solagree.', path: '/webinars' })
</script>

<template>
  <main>
    <section class="section-shell webinar-catalog">
      <h1 class="editorial-display">Webinars &amp; Events</h1>
      <p>Learn about a more structured approach to divorce with the Solagree team.</p>
      <p v-if="status === 'pending' || status === 'idle'" role="status">Loading webinars…</p>
      <div v-else-if="error" role="alert">
        <p>Webinars are temporarily unavailable.</p>
        <button class="sol-button sol-button--primary" type="button" @click="refresh()">Try again</button>
      </div>
      <p v-else-if="!webinars?.length">New webinars will be announced here soon.</p>
      <div v-else class="webinar-catalog__grid">
        <article v-for="webinar in webinars" :key="webinar.id" class="webinar-catalog__card">
          <p>{{ webinar.format === 'on_demand' ? 'On-Demand' : 'Live Webinar' }}</p>
          <h2><NuxtLink :to="`/webinars/${encodeURIComponent(webinar.id)}`">{{ webinar.title }}</NuxtLink></h2>
          <p>{{ webinar.description }}</p>
          <p>Hosted by {{ webinar.host }}</p>
          <p><time v-if="webinar.startsAt" :datetime="webinar.startsAt">{{ formatWebinarDate(webinar) }}</time><span v-else>Watch on demand</span></p>
          <p v-if="webinar.state === 'recording_coming_soon'">Recording coming soon</p>
          <a v-else-if="webinar.state === 'upcoming' || webinar.state === 'live'" :href="getWebinarLiveRegistrationUrl(config.public.portalApiBaseUrl, webinar.id)" class="sol-button sol-button--primary">Register on Zoom</a>
          <NuxtLink v-else :to="`/webinars/${encodeURIComponent(webinar.id)}`" class="sol-button sol-button--primary">Watch webinar</NuxtLink>
        </article>
      </div>
      <nav class="webinar-catalog__legacy" aria-label="Partner introduction webinars">
        <NuxtLink to="/webinar">Attorney partner introduction</NuxtLink>
        <NuxtLink to="/webinar/cdfa">CDFA partner introduction</NuxtLink>
      </nav>
    </section>
    <SiteFooter />
  </main>
</template>

<style scoped>
.webinar-catalog { padding-block: 4rem; }
.webinar-catalog > p { margin-block: 1.5rem; }
.webinar-catalog__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); gap: 1.5rem; margin-block: 2rem; }
.webinar-catalog__card { border: 1px solid #d5ddd6; border-radius: 1rem; padding: 1.5rem; overflow-wrap: anywhere; }
.webinar-catalog__card h2 { font-size: 1.6rem; margin-block: 1rem; }
.webinar-catalog__card p { margin-block: 1rem; white-space: pre-line; }
.webinar-catalog__legacy { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 3rem; text-decoration: underline; }
</style>
