import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { rewriteReferenceLink } from './remark-reference-links'

const source = path.resolve('/workspace/radashi/docs/array/alphabetical.mdx')
const existingFiles = new Set([
  path.resolve('/workspace/radashi/docs/array/sort.mdx'),
  path.resolve('/workspace/radashi/docs/number/round.mdx'),
])
const rewrite = (destination: string, file = source) =>
  rewriteReferenceLink(destination, file, candidate =>
    existingFiles.has(candidate)
  )

test('rewrites filesystem-relative links to sibling reference routes', () => {
  assert.equal(rewrite('./sort'), '/reference/array/sort/')
  assert.equal(
    rewrite('./sort?order=asc#examples'),
    '/reference/array/sort/?order=asc#examples'
  )
  assert.equal(
    rewrite('../number/round.mdx#precision'),
    '/reference/number/round/#precision'
  )
})

test('preserves destinations that are not generated reference pages', () => {
  for (const destination of [
    '#examples',
    '?view=compact',
    'https://example.com/docs',
    '//example.com/docs',
    '/installation/',
    'sort',
    './missing',
    '../../../outside',
  ]) {
    assert.equal(rewrite(destination), destination)
  }
})

test('does not rewrite relative links from non-reference content', () => {
  assert.equal(
    rewrite('./sort', '/workspace/src/content/docs/guide.mdx'),
    './sort'
  )
})
