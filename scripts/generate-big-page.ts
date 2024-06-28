import glob from 'fast-glob'
import matter, { GrayMatterFile } from 'gray-matter'
import { readFile, writeFile } from 'node:fs/promises'
import dedent from 'dedent'

main()

async function main() {
  const sections: Record<string, Section> = {}

  for (const file of await glob('radashi/docs/**/*.mdx')) {
    const { data, content } = matter(
      await readFile(file)
    ) as GrayMatterFile<any> & {
      data: FunctionInfo
      content: string
    }
    const section = (sections[data.group] ||= {
      name: data.group,
      functions: [],
    })
    section.functions.push(renderFunction(content, data))
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
  group: string
}

function renderFunction(content: string, data: FunctionInfo) {
  const header = dedent`
    <header>
      ## ${data.title}
      <p>${data.description}</p>
    </header>
  `

  return (
    header + '\n\n' + content.replace(/#{2,}/g, prefix => '#' + prefix).trim()
  )
}

function renderIndex(sections: Record<string, Section>) {
  const metadata = dedent`
    ---
    title: API Reference
    tableOfContents:
      maxHeadingLevel: 2
    ---
  `

  const content = Object.entries(sections)
    .map(([name, section]) => `# ${name}\n\n${section.functions.join('\n\n')}`)
    .join('\n\n')

  return metadata + '\n\n' + content
}
