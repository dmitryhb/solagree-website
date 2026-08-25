import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SITEMAP_PATH = fileURLToPath(new URL('../.output/public/sitemap.xml', import.meta.url))

const failure = (message) => {
  console.error(`Sitemap verification failed: ${message}`)
  console.error('The static deployment must not continue without a valid prerendered sitemap.')
  process.exit(1)
}

let sitemap

try {
  sitemap = readFileSync(SITEMAP_PATH, 'utf8')
} catch {
  failure(`${SITEMAP_PATH} is missing. Ensure nuxt.config.ts prerenders "/sitemap.xml" and "npm run generate" completed.`)
}

if (sitemap.trim().length === 0) {
  failure(`${SITEMAP_PATH} is empty.`)
}

const trimmed = sitemap.trim()

if (!trimmed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  failure(`${SITEMAP_PATH} does not start with an XML declaration. First bytes: ${JSON.stringify(trimmed.slice(0, 120))}`)
}

if (!trimmed.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
  failure(`${SITEMAP_PATH} does not contain a sitemap urlset root element.`)
}

if (!trimmed.endsWith('</urlset>')) {
  failure(`${SITEMAP_PATH} does not end with a closing </urlset> tag.`)
}

const htmlFallbackMarkers = ['<!doctype html', '<html', '<head', '<script', '__nuxt']
const foundHtmlMarker = htmlFallbackMarkers.find(marker => trimmed.toLowerCase().includes(marker))

if (foundHtmlMarker !== undefined) {
  failure(`${SITEMAP_PATH} looks like the HTML/Nuxt fallback shell (found "${foundHtmlMarker}") instead of XML.`)
}

const openUrls = trimmed.match(/<url>/g)?.length ?? 0
const closeUrls = trimmed.match(/<\/url>/g)?.length ?? 0
const locs = [...trimmed.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1] || '')

if (openUrls === 0) {
  failure(`${SITEMAP_PATH} contains no <url> entries.`)
}

if (openUrls !== closeUrls || openUrls !== locs.length) {
  failure(`${SITEMAP_PATH} has malformed url entries: ${openUrls} <url>, ${closeUrls} </url>, ${locs.length} <loc>.`)
}

const origins = new Set(locs.map(loc => new URL(loc).origin))

if (origins.size !== 1) {
  failure(`${SITEMAP_PATH} mixes multiple origins: ${[...origins].join(', ')}.`)
}

const [origin] = origins
const expectedSiteUrl = process.env.NUXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')

if (expectedSiteUrl && origin !== new URL(expectedSiteUrl).origin) {
  failure(`${SITEMAP_PATH} uses origin ${origin} but NUXT_PUBLIC_SITE_URL expects ${new URL(expectedSiteUrl).origin}.`)
}

console.log(`Sitemap verification passed: ${SITEMAP_PATH} (${locs.length} URLs, origin ${origin})`)
