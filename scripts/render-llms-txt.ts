import matter, { GrayMatterFile } from 'gray-matter'
import { readFile } from 'node:fs/promises'
import { capitalize, group } from 'radashi'
import { globSync } from 'tinyglobby'

const categoryDescriptions: Record<string, string> = {
  array: 'Array manipulation and transformation',
  async: 'Async/await utilities and control flow',
  curry: 'Function composition and partial application',
  function: 'Function utilities and helpers',
  number: 'Numeric operations and parsing',
  object: 'Object manipulation and transformation',
  oop: 'Object-oriented patterns and classes',
  random: 'Random value generation',
  series: 'Series and sequence operations',
  string: 'String transformation and formatting',
  typed: 'Type guards and type checking',
}

const nameOverrides: Record<string, string> = {
  oop: 'OOP',
}

type FunctionInfo = {
  title: string
  description: string
}

type FunctionEntry = {
  slug: string
  category: string
  data: FunctionInfo
  content: string
}

export async function renderLlmsTxt() {
  const entries: FunctionEntry[] = []

  for (const file of globSync('radashi/docs/**/*.mdx').sort()) {
    const slug = file
      .replace(/\.mdx$/, '')
      .split('/')
      .slice(2)
      .join('/')

    const raw = await readFile(file, 'utf8')
    const { data, content } = matter(raw) as GrayMatterFile<string> & {
      data: FunctionInfo
    }

    entries.push({
      slug,
      category: slug.split('/')[0],
      data,
      content: content.trim(),
    })
  }

  const grouped = group(entries, e => e.category)

  return {
    index: renderIndex(grouped),
    full: renderFull(grouped),
  }
}

function categoryName(category: string) {
  return nameOverrides[category] ?? capitalize(category)
}

function renderIndex(grouped: Partial<Record<string, FunctionEntry[]>>) {
  const lines: string[] = [
    '# Radashi',
    '',
    '> A TypeScript utility toolkit with lightweight, readable, performant, and robust functions.',
    '>',
    '> - Tree-shakeable, dependency-free, type-safe',
    '> - Full test coverage, actively maintained',
    '> - https://radashi.js.org',
    '',
    'For complete documentation of each function, see [llms-full.txt](https://radashi.js.org/llms-full.txt).',
    '',
  ]

  for (const [category, entries] of Object.entries(grouped)) {
    if (!entries) continue
    const desc = categoryDescriptions[category] ?? ''
    lines.push(`## ${categoryName(category)}`)
    if (desc) {
      lines.push('')
      lines.push(desc)
    }
    lines.push('')

    for (const entry of entries) {
      const url = `https://radashi.js.org/reference/${entry.slug}`
      lines.push(`- [${entry.data.title}](${url}): ${entry.data.description}`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

function renderFull(grouped: Partial<Record<string, FunctionEntry[]>>) {
  const lines: string[] = [
    '# Radashi',
    '',
    '> A TypeScript utility toolkit with lightweight, readable, performant, and robust functions.',
    '',
    '## Installation',
    '',
    '```sh',
    'npm install radashi',
    '```',
    '',
    '## Usage',
    '',
    '```ts',
    "import * as _ from 'radashi'",
    '',
    '// Or import individual functions',
    "import { unique, retry, pick } from 'radashi'",
    '```',
    '',
  ]

  for (const [category, entries] of Object.entries(grouped)) {
    if (!entries) continue
    const desc = categoryDescriptions[category] ?? ''
    lines.push(`## ${categoryName(category)}`)
    if (desc) {
      lines.push('')
      lines.push(desc)
    }
    lines.push('')

    for (const entry of entries) {
      lines.push(`### ${entry.data.title}`)
      lines.push('')
      lines.push(entry.data.description)
      lines.push('')
      lines.push(entry.content)
      lines.push('')
    }
  }

  return lines.join('\n')
}
