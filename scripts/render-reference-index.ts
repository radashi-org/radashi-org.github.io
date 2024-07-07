import dedent from 'dedent'
import glob from 'fast-glob'
import matter, { GrayMatterFile } from 'gray-matter'
import { readFile } from 'node:fs/promises'

export async function renderReferenceIndex() {
  const sections: Record<string, Section> = {}

  for (const file of glob.sync('radashi/docs/**/*.mdx').sort()) {
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

  return renderIndex(sections)
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
