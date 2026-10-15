<script setup lang="ts">
const briefings = [
  {
    audience: 'attorney',
    image: '/images/webinars/attorney-briefing.png',
    alt: 'The future of family law practice - Solagree partner network for attorneys',
    duration: '9:58',
    title: 'Add flat-fee cases without adding staff',
    description: 'What six to seven advisory hours is worth when you set the fee, and how to run it alongside your litigation practice.',
    to: '/webinar'
  },
  {
    audience: 'cdfa',
    image: '/images/webinars/cdfa-briefing.png',
    alt: 'The future of divorce financial analysis - Solagree partner network for CDFAs',
    duration: '5:18',
    title: 'Lead the financial intake',
    description: 'Why Solagree puts CDFAs at the front of the process, and what partnering looks like for your practice.',
    to: '/webinar/cdfa'
  }
]
</script>

<template>
  <section class="briefings" aria-labelledby="briefings-title">
    <div class="briefings__inner">
      <header class="briefings__intro">
        <p class="briefings__eyebrow">Webinars &amp; Events</p>
        <h1 id="briefings-title">Partner briefings &amp; live sessions</h1>
        <p>Short on-demand briefings for professionals considering a Solagree partnership, and live sessions with the team.</p>
      </header>
      <div class="briefings__grid">
        <article v-for="briefing in briefings" :key="briefing.audience" class="briefings__card" :class="`briefings__card--${briefing.audience}`">
          <img class="briefings__image" :src="briefing.image" :alt="briefing.alt" width="1920" height="1080">
          <div class="briefings__body">
            <p class="briefings__meta"><span class="briefings__badge">On-demand</span><span :aria-label="`Duration ${briefing.duration}`">{{ briefing.duration }}</span></p>
            <h2>{{ briefing.title }}</h2>
            <p>{{ briefing.description }}</p>
          </div>
          <NuxtLink :to="briefing.to" class="briefings__action" :aria-label="`Register to watch: ${briefing.title}`">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 3.5v9l7-4.5z" /></svg>
            Register to watch
          </NuxtLink>
        </article>
        <article class="briefings__card">
          <img class="briefings__image" src="/images/webinars/live-sessions.png" alt="Solagree live sessions - briefings and Q&A with the Solagree team for all partners" width="1920" height="1080">
          <div class="briefings__body">
            <p class="briefings__meta"><span class="briefings__badge">Next session TBA</span></p>
            <h2>Join an upcoming live session</h2>
            <p>Contact the Solagree team to ask about upcoming briefings and Q&amp;A sessions.</p>
          </div>
          <NuxtLink to="/contact" class="briefings__action">Contact us</NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.briefings { background: #f4f0e9; color: #5b5268; padding: 72px 24px 88px; font-family: var(--font-nav); }
.briefings__inner { max-width: 1200px; margin-inline: auto; }
.briefings__intro { max-width: 720px; margin-bottom: 44px; }
.briefings__intro .briefings__eyebrow { color: #7a5342; font-size: 13px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 14px; }
.briefings__intro h1 { margin: 0 0 14px; color: #4a3f5e; font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); line-height: 1.1; font-weight: 500; }
.briefings__intro > p:last-child { font-size: 17px; line-height: 1.6; margin: 0; }
.briefings__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 28px; align-items: stretch; }
.briefings__card { display: flex; flex-direction: column; gap: 22px; min-width: 0; padding: 16px; background: #fff; border: 1px solid #e4ded3; border-radius: 22px; }
.briefings__image { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border-radius: 14px; }
.briefings__body { display: flex; flex: 1; flex-direction: column; gap: 12px; padding-inline: 8px; }
.briefings__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #6e6679; }
.briefings__badge { padding: 5px 11px; border-radius: 999px; color: #4a3f5e; background: #eeebf3; }
.briefings__card--cdfa .briefings__badge { color: #7a5342; background: #f5ece5; }
.briefings__body h2 { margin: 0; color: #4a3f5e; font-family: var(--font-display); font-size: 25px; line-height: 1.2; font-weight: 600; }
.briefings__body > p { margin: 0; }
.briefings__body > p:last-child { font-size: 15px; line-height: 1.6; }
.briefings__action { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; margin: 0 8px 8px; padding: 10px 12px; border-radius: 12px; background: #4a3f5e; color: #fffdf9; font-size: 15px; line-height: 1.4; font-weight: 500; text-align: center; text-decoration: none; }
.briefings__action:hover { background: #2f2840; color: #fffdf9; }
.briefings__action:focus-visible { outline: 3px solid #9b604b; outline-offset: 4px; }
@media (max-width: 600px) { .briefings { padding: 40px 16px 56px; } .briefings__grid { gap: 24px; } }
</style>
