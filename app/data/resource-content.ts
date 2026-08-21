import {
  getPublishedArticles,
  getPublishedNewsItems,
  validateResourceContentEntries
} from '#shared/resource-content-validation'
import type { ResourceContentEntry } from '#shared/types/resource-content'

/**
 * The Git-managed source for Blog articles and external News & Press entries.
 * New entries must pass validation here before Nuxt can build or render them.
 */
export const resourceContentEntries = [
  {
    author: 'Doing Divorce Right by Chief PeaceKeeper™ Scott Levin',
    category: 'Podcast',
    externalUrl: 'https://divorcemediationattorneyscottlevin.buzzsprout.com/2243813/episodes/19055580-rethinking-divorce-inside-the-solagree-process-with-amanda-mason?t=0',
    kind: 'news',
    linkMode: 'external',
    publishedAt: '2026-04-22',
    seo: {
      description: 'Amanda Mason joins Scott Levin to discuss Solagree’s collaborative, streamlined approach to divorce resolution.',
      title: 'Rethinking Divorce: Inside the Solagree Process with Amanda Mason'
    },
    slug: 'doing-divorce-right-rethinking-divorce',
    social: {
      description: 'Amanda Mason joins Scott Levin to discuss Solagree’s collaborative, streamlined approach to divorce resolution.',
      image: '/images/splash-bg.webp',
      title: 'Rethinking Divorce: Inside the Solagree Process with Amanda Mason'
    },
    status: 'published',
    summary: 'Scott Levin speaks with Amanda Mason about Solagree’s approach to divorce, combining mediation, arbitration, and transparent flat-fee pricing.',
    title: 'Rethinking Divorce: Inside the Solagree Process with Amanda Mason'
  },
  {
    author: 'The Gray Divorce Podcast',
    category: 'Podcast',
    externalUrl: 'https://thegraydivorcepodcast.buzzsprout.com/2067333/episodes/18416657-solagree-an-alternative-to-litigation-with-amanda-mason',
    kind: 'news',
    linkMode: 'external',
    publishedAt: '2025-12-27',
    seo: {
      description: 'Amanda Mason discusses Solagree’s alternative to litigation on The Gray Divorce Podcast.',
      title: 'Solagree - An Alternative to Litigation with Amanda Mason'
    },
    slug: 'gray-divorce-solagree-alternative-to-litigation',
    social: {
      description: 'Amanda Mason discusses Solagree’s alternative to litigation on The Gray Divorce Podcast.',
      image: '/images/splash-bg.webp',
      title: 'Solagree - An Alternative to Litigation with Amanda Mason'
    },
    status: 'published',
    summary: 'Andrew Hatherley talks with Amanda Mason about a divorce process built around cooperation, predictability, and resolution outside the courtroom.',
    title: 'Solagree - An Alternative to Litigation with Amanda Mason'
  },
  {
    author: 'Institute for Divorce Financial Analysts®',
    category: 'Podcast',
    externalUrl: 'https://www.youtube.com/watch?v=aJo9Zw4ZF1w',
    kind: 'news',
    linkMode: 'external',
    // LinkedIn activity ID 7397642704173658112 encodes 2025-11-21T14:31:02.230Z.
    publishedAt: '2025-11-21',
    seo: {
      description: 'Amanda Mason explains mediation, arbitration, and court options in Episode 9 of the CDFA Hotline Podcast.',
      title: 'The Divorce You Deserve: Peaceful, Private, and Professional'
    },
    slug: 'cdfa-hotline-the-divorce-you-deserve',
    social: {
      description: 'Amanda Mason explains mediation, arbitration, and court options in Episode 9 of the CDFA Hotline Podcast.',
      image: '/images/splash-bg.webp',
      title: 'The Divorce You Deserve: Peaceful, Private, and Professional'
    },
    status: 'published',
    summary: 'In Episode 9 of the CDFA Hotline Podcast, Amanda Mason explains the differences between mediation, arbitration, and going to court.',
    title: 'The Divorce You Deserve: Peaceful, Private, and Professional'
  },
  {
    author: 'Divorcing Strong',
    category: 'Podcast',
    externalUrl: 'https://music.amazon.com/es-us/podcasts/39d342b8-e78f-4731-a60c-2d2cf5a9d942/divorcing-strong',
    kind: 'news',
    linkMode: 'external',
    publishedAt: '2026-05-14',
    seo: {
      description: 'Amanda Mason joins Divorcing Strong to discuss family court, attorney red flags, divorce advice, and healing after divorce.',
      title: 'Family Court Is Broken: Former Divorce Lawyer Amanda Mason on Attorney Red Flags, Divorce Advice & Healing After Divorce'
    },
    slug: 'divorcing-strong-family-court-is-broken',
    social: {
      description: 'Amanda Mason joins Divorcing Strong to discuss family court, attorney red flags, divorce advice, and healing after divorce.',
      image: '/images/splash-bg.webp',
      title: 'Family Court Is Broken: Former Divorce Lawyer Amanda Mason on Attorney Red Flags, Divorce Advice & Healing After Divorce'
    },
    status: 'published',
    summary: 'Amanda Mason joins Becky Sampson for a conversation about family court, divorce advice, and a less adversarial path forward.',
    title: 'Family Court Is Broken: Former Divorce Lawyer Amanda Mason on Attorney Red Flags, Divorce Advice & Healing After Divorce'
  }
] as const satisfies readonly ResourceContentEntry[]

validateResourceContentEntries(resourceContentEntries)

/** Public internal articles, intentionally excluding drafts from all consumers. */
export const publishedArticles = getPublishedArticles(resourceContentEntries)

/** Public external News & Press items, intentionally excluding drafts from all consumers. */
export const publishedNewsItems = getPublishedNewsItems(resourceContentEntries)
