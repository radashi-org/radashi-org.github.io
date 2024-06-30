import glob from 'fast-glob'
import matter, { GrayMatterFile } from 'gray-matter'
import { readFile, writeFile } from 'node:fs/promises'
import dedent from 'dedent'

main()

async function main() {
  const sections: Record<string, Section> = {}

  for (const file of await glob('radashi/docs/**/*.mdx')) {
    const slug = file
      .replace(/\.mdx$/, '')
      .split('/')
      .slice(2) // Remove "radashi/docs/"
      .join('/')

    const { data, content } = matter(
      await readFile(file)
    ) as GrayMatterFile<any> & {
      data: FunctionInfo
      content: string
    }

    const sectionId = slug.split('/')[0]
    const section = (sections[sectionId] ||= {
      name: sectionId[0].toUpperCase() + sectionId.slice(1),
      functions: [],
    })

    section.functions.push(renderFunction(slug, data))
  }

  await writeFile('src/content/docs/reference/index.mdx', renderIndex(sections))
}

type Section = {
  name: string
  functions: string[]
}

type FunctionInfo = {
  title: string
  description: string
}

function renderFunction(slug: string, data: FunctionInfo) {
  return dedent`
    <a href="/reference/${slug}" class="big-page-link">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
    </a>
  `
}

function renderIndex(sections: Record<string, Section>) {
  const metadata = dedent`
    ---
    title: Functions overview
    tableOfContents: false
    next: false
    ---

    Welcome to the Radashi API Reference.
  `

  const content = Object.values(sections)
    .map(section => `# ${section.name}\n\n${section.functions.join('\n\n')}`)
    .join('\n\n')

  return metadata + '\n\n' + content
}
