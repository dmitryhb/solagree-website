import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { publishedArticles, publishedNewsItems } from '../app/data/resource-content'

const assetDetails = [
  ['blog-hidden-risks-naked-mediation.webp', 1208, 716, 96172, 'f22ae36edefbc11784436f9ea514d5b98cacee2013f9196c749a34a1c1995c6d'],
  ['blog-relieving-uneasy-feeling-resolving-divorce.webp', 1280, 854, 119930, 'c8101ebbefe644a2a5c87a04a74bd0bb0ead763ee5fed177d090b975db8b80a1'],
  ['blog-ai-divorce-family-law.webp', 1248, 832, 58926, 'd3fe5b07a011ce8a1ac2b676852f7c95db7b1bed959c81ab2259f108561a0b27'],
  ['news-doing-divorce-right-rethinking-divorce.webp', 768, 768, 98540, '78345d39fef946164f87cf3ed7f1b392d1cfed6e414e6b6d64b9da9e8ea98ae3'],
  ['news-gray-divorce-solagree-alternative-to-litigation.webp', 600, 600, 37696, '1daa408208c0dc2efcd7daeccde54b302a75d9fcbf6bd39b9b85268c89d0d655'],
  ['news-cdfa-hotline-the-divorce-you-deserve.webp', 1024, 198, 21946, '2e8fdd022522088cea1788cfab0d04189ad47a99f36975505f2a51621ab7aaaa'],
  ['news-divorcing-strong-family-court-is-broken.webp', 768, 768, 50050, 'b8bbec2634a6b457128545d13f03f49589a139c61763db7b8896eb2e38c5c931']
] as const

/** Reads dimensions from the lossless and lossy WebP payloads used for approved Figma assets. */
const getWebpDimensions = (asset: Buffer): { height: number, width: number } => {
  const chunk = asset.subarray(12, 16).toString('ascii')

  if (chunk === 'VP8 ') {
    return {
      height: asset.readUInt16LE(28) & 0x3fff,
      width: asset.readUInt16LE(26) & 0x3fff
    }
  }

  if (chunk === 'VP8L') {
    const bits = asset.readUInt32LE(21)

    return {
      height: ((bits >> 14) & 0x3fff) + 1,
      width: (bits & 0x3fff) + 1
    }
  }

  throw new Error(`Unsupported WebP payload ${chunk}.`)
}

describe('Approved Blog and News media assets', () => {
  it('commits the optimized Figma assets at their expected paths, dimensions, and sizes', () => {
    for (const [filename, width, height, size, hash] of assetDetails) {
      const assetPath = resolve(process.cwd(), 'public/images', filename)
      const asset = readFileSync(assetPath)

      expect(asset.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(asset.subarray(8, 12).toString('ascii')).toBe('WEBP')
      expect(getWebpDimensions(asset)).toEqual({ height, width })
      expect(statSync(assetPath).size).toBe(size)
      expect(createHash('sha256').update(asset).digest('hex')).toBe(hash)
    }
  })

  it('assigns an approved local image to every published Blog and News card', () => {
    const entries = [...publishedArticles, ...publishedNewsItems]

    expect(entries).toHaveLength(8)
    expect(entries.every(entry => entry.featuredImage?.startsWith('/images/'))).toBe(true)
  })
})
