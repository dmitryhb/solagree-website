import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

const root = resolve(process.cwd(), 'public/legal/partner-terms/2026-10-06')
const manifest = JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8'))
const source = JSON.parse(readFileSync(resolve(process.cwd(), 'docs/legal/partner-terms-2026-10-06.source.json'), 'utf8'))
const document = new JSDOM(readFileSync(resolve(root, 'index.html'), 'utf8')).window.document

describe('approved immutable Partner Terms snapshot', () => {
  it('retains the release identity and checksums for the complete hosted artifact', () => {
    expect(manifest.documentId).toBe('solagree-partner-terms')
    expect(manifest.version).toBe('2026-10-06')
    expect(manifest.url).toBe('https://solagree.com/legal/partner-terms/2026-10-06/')
    expect(manifest.sourceRevision).toBe(source.revisionId)
    expect(manifest.files).toEqual({"approved-source.txt": "957a1191a4ebed3ce3a6b3a45a9ab92b461d32093ecbc9339d939738e0919709", "index.html": "18106cc9759517a1124af211605cac10ba8bdbbeceda41d9acbada8df94c7939", "solagree-logo.png": "e671258267569ac57a8e06f947da98bc8a18deb9fbb81d6b3fef59caa59eaf9e"})
    expect(createHash('sha256').update(readFileSync(resolve(process.cwd(), 'docs/legal/partner-terms-2026-10-06.source.json'))).digest('hex')).toBe(manifest.sourceSnapshotSha256)
    for (const [file, hash] of Object.entries(manifest.files)) {
      expect(createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex')).toBe(hash)
    }
  })

  it('preserves every approved paragraph verbatim, both schedules, and the licensed logo', () => {
    type SourceItem = { paragraph?: { elements: Array<{ textRun?: { content: string } }> }, table?: { tableRows: Array<{ tableCells: Array<{ content: SourceItem[] }> }> } }
    const collect = (items: SourceItem[]): string[] => {
      return items.flatMap(item => item.paragraph
        ? [item.paragraph.elements.map(element => element.textRun?.content ?? '').join('').replace(/\n$/, '')].filter(text => text.trim() !== '')
        : item.table?.tableRows.flatMap(row => row.tableCells.flatMap(cell => collect(cell.content))) ?? [])
    }
    const approved = collect(source.tabs[0].body.content)
    const hosted = [...document.querySelectorAll('main h1, main h2, main p:not(.version)')]
      .map(element => element.textContent ?? '').filter(text => text.trim() !== '')
    expect(hosted).toEqual(approved)
    expect(document.querySelectorAll('table tbody tr')).toHaveLength(2)
    expect(document.querySelector('img')?.getAttribute('alt')).toBe('SOLAGREE logo')
    expect(document.querySelector('img')?.getAttribute('src')).toBe('solagree-logo.png')
    expect(document.querySelectorAll('h1')).toHaveLength(1)
  })
})
