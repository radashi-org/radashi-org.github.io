#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'

const PROMPT_TEMPLATE = `Refactor this JavaScript/TypeScript repository by replacing hand-written local helpers with Radashi imports where behavior is compatible.

Primary candidate identifiers are the exact, case-sensitive "name" values in the Radashi export data below. Secondary candidate identifiers are the "aliases" values. The "category" value is context only; verify exact semantics from installed Radashi source/types or official docs before replacing.

Rules:
- Consider local hand-written helper declarations whose identifier exactly matches a candidate name or alias.
- Treat alias matches as lower-confidence candidates; replace them only with strong semantic evidence.
- Compare the local implementation, call sites, public exports, and Radashi semantics.
- Replace only when Radashi preserves observable behavior for current usage and does not change public API shape.
- Preserve exported module paths/names when applicable; prefer replacing the implementation or re-exporting over forcing downstream import changes.
- Use named imports from "radashi". Remove dead local implementation/types made obsolete by the replacement.
- Run relevant lint, typecheck, and tests for touched packages.

Final report:
- replacements made
- noteworthy skipped candidates with reasons
- verification commands and results

Radashi export data ({{RADASHI_FUNCTION_COUNT}} entries):

\`\`\`json
{{RADASHI_FUNCTION_DATA}}
\`\`\`
`

function usage() {
  return `Usage: node scripts/generate-radashi-replacement-prompt.mjs [--root <repo-root>] [--radashi-docs <path>]

Generates an AI refactoring prompt by combining a static prompt with the Radashi
function list discovered from <repo-root>/radashi/docs/**/*.mdx.

Options:
  --root <path>          Repository root to scan. Defaults to the current directory.
  --radashi-docs <path>  Radashi MDX docs directory. Defaults to <root>/radashi/docs.
  -h, --help             Print this help text.
`
}

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '-h' || arg === '--help') {
      args.help = true
      continue
    }

    if (arg === '--root') {
      const value = argv[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('--root requires a path')
      }
      args.root = value
      i += 1
      continue
    }

    if (arg === '--radashi-docs') {
      const value = argv[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('--radashi-docs requires a path')
      }
      args.radashiDocs = value
      i += 1
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return args
}

function discoverRadashiFunctions(root, radashiDocs) {
  const docsDir = resolve(root, radashiDocs ?? 'radashi/docs')

  if (!existsSync(docsDir)) {
    throw new Error(`Could not find Radashi MDX docs directory: ${docsDir}`)
  }

  const functions = walkMdxFiles(docsDir).map(file => {
    const frontmatter = parseFrontmatter(readFileSync(file, 'utf8'), file)
    const name = parseScalar(frontmatter, 'title') ?? basename(file, '.mdx')
    const slug = relative(docsDir, file).replace(/\.mdx$/, '')

    return {
      name,
      category: dirname(slug),
      aliases: parseArray(frontmatter, 'aliases'),
    }
  })

  if (functions.length === 0) {
    throw new Error(`No Radashi MDX docs found under: ${docsDir}`)
  }

  return functions.sort(
    (a, b) => a.name.localeCompare(b.name) || a.category.localeCompare(b.category)
  )
}

function walkMdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      return walkMdxFiles(file)
    }
    return entry.isFile() && entry.name.endsWith('.mdx') ? [file] : []
  })
}

function parseFrontmatter(content, file) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    throw new Error(`Missing frontmatter in ${file}`)
  }
  return match[1]
}

function parseScalar(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))
  return match ? unquote(match[1].trim()) : undefined
}

function parseArray(frontmatter, field) {
  const lines = frontmatter.split('\n')
  const fieldIndex = lines.findIndex(line => line.startsWith(`${field}:`))
  if (fieldIndex === -1) {
    return []
  }

  const firstLine = lines[fieldIndex].slice(field.length + 1).trim()
  if (firstLine.startsWith('[') && firstLine.endsWith(']')) {
    return firstLine
      .slice(1, -1)
      .split(',')
      .map(value => unquote(value.trim()))
      .filter(Boolean)
  }

  const values = []
  for (const line of lines.slice(fieldIndex + 1)) {
    const match = line.match(/^\s+-\s+(.+)$/)
    if (!match) {
      break
    }
    values.push(unquote(match[1].trim()))
  }
  return values
}

function unquote(value) {
  return value.replace(/^['"]|['"]$/g, '')
}

function generatePrompt(data) {
  return PROMPT_TEMPLATE
    .replace('{{RADASHI_FUNCTION_COUNT}}', String(data.length))
    .replace('{{RADASHI_FUNCTION_DATA}}', JSON.stringify(data, null, 2))
}

try {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    process.stdout.write(usage())
    process.exit(0)
  }

  process.stdout.write(
    generatePrompt(discoverRadashiFunctions(args.root, args.radashiDocs))
  )
  process.stdout.write('\n')
} catch (error) {
  process.stderr.write(`${error.message}\n\n${usage()}`)
  process.exit(1)
}
