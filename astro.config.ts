import preact from '@astrojs/preact'
import starlight from '@astrojs/starlight'
import { StarlightUserConfig } from '@astrojs/starlight/types'
import mdAstro from '@astropub/md'
import exec from '@cush/exec'
import unocss from '@unocss/astro'
import { defineConfig } from 'astro/config'
import ecTwoSlash from 'expressive-code-twoslash'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'node:path'
import { group, title } from 'radashi'
import { globSync } from 'tinyglobby'
import virtual from 'vite-plugin-virtual'
import { renderHeftJson } from './scripts/render-heft-json'
import { renderLlmsTxt } from './scripts/render-llms-txt'
import { renderReferenceIndex } from './scripts/render-reference-index'

type SidebarItem = (StarlightUserConfig['sidebar'] & object)[number]

// https://astro.build/config
export default defineConfig({
  site: 'https://radashi.js.org',
  integrations: [
    mdAstro(),
    starlight({
      title: 'Radashi',
      tableOfContents: false,
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: '',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap',
          },
        },
      ],
      logo: {
        light: './src/assets/radashi-logo-dark@3x.webp',
        dark: './src/assets/radashi-logo-dark@3x.webp',
        replacesTitle: true,
      },
      editLink: {
        baseUrl: 'https://github.com/radashi-org/radashi/edit/main/docs/',
      },
      expressiveCode: {
        themes: ['github-dark-dimmed'],
        plugins: [
          ecTwoSlash({
            twoslashOptions: {
              compilerOptions: {
                allowImportingTsExtensions: true,
                lib: [
                  'lib.es2022.d.ts',
                  'lib.dom.d.ts',
                  'lib.dom.iterable.d.ts',
                ],
                paths: {
                  // Resolve examples against the checked-out Radashi source.
                  radashi: [
                    path.resolve('radashi/src/mod.ts'),
                    path.resolve('../src/mod.ts'),
                  ],
                },
                types: ['node'],
              },
            },
          }),
        ],
      },
      sidebar: generateSidebar(),
      customCss: ['./src/styles/custom.css', './src/styles/dark-theme.css'],
    }),
    unocss(),
    preact(),
    // minify(),
  ],
  build: {
    assets: 'assets',
  },
  vite: {
    plugins: [radashi()],
    build: {
      minify: 'terser',
    },
  },
})

async function radashi() {
  if (!existsSync('radashi')) {
    console.log('Cloning radashi...')
    await exec('git clone https://github.com/radashi-org/radashi --depth 1', {
      stdio: 'inherit',
    })
  } else if (process.env.NODE_ENV !== 'production') {
    // During development, we want to pull the latest version of Radashi from
    // GitHub so that we can test unpublished changes to the docs.
    console.log('Pulling radashi...')
    await exec('git pull', { cwd: 'radashi', stdio: 'inherit' })
  }

  const heft = await renderHeftJson()

  console.log('Generating API reference index page...')
  const content = await renderReferenceIndex()
  mkdirSync('src/content/docs/reference', { recursive: true })
  writeFileSync('src/content/docs/reference/index.mdx', content)

  console.log('Generating llms.txt files...')
  const llmsTxt = await renderLlmsTxt()
  writeFileSync('public/llms.txt', llmsTxt.index)
  writeFileSync('public/llms-full.txt', llmsTxt.full)

  console.log('Generating Radashi replacement prompt...')
  execFileSync(
    process.execPath,
    [
      path.resolve('scripts/generate-radashi-replacement-prompt.mjs'),
      '--radashi-docs',
      path.resolve('radashi/docs'),
      '--output',
      path.resolve('public/prompts/radashi-replacement.md'),
    ],
    { stdio: 'inherit' }
  )

  return [
    virtual({
      'virtual:radashi/heft': heft,
    }),
  ]
}

function generateSidebar(): SidebarItem[] {
  const separatorItem = {
    separator: '0.6px solid rgba(240, 240, 240, 0.1)',
  }

  return [
    {
      label: 'Getting Started',
      items: [
        h3('Introduction', {
          link: '/',
        }),
        h3('Installation'),
        h3('Contributing'),
      ],
    },
    separatorItem,
    {
      label: 'Quick Links',
      items: [
        h3('Our Ethos'), //
        h3('Browser Support'),
        h3('Changelog'),
        h3('Playground', {
          attrs: {
            'data-no-swup': '',
          },
        }),
        h3('AI Prompt', {
          link: 'prompts/radashi-replacement',
        }),
      ],
    },
    separatorItem,
    h3('VS Code', {
      icon: '/sidebar/vscode.svg',
      link: 'https://marketplace.visualstudio.com/items?itemName=aleclarson.radashi',
      class: 'top-level-link',
    }),
    h3('Community', {
      icon: '/sidebar/community.svg',
      link: 'https://github.com/orgs/radashi-org/discussions',
      class: 'top-level-link',
    }),
    h3('Github', {
      icon: '/sidebar/github.svg',
      link: 'https://github.com/radashi-org/radashi',
      class: 'top-level-link',
    }),
    h3('NPM', {
      icon: '/sidebar/npm.svg',
      link: 'https://www.npmjs.com/package/radashi',
      class: 'top-level-link',
    }),
    h3('JSR.io', {
      icon: '/sidebar/jsr.svg',
      link: 'https://jsr.io/@radashi-org/radashi',
      class: 'top-level-link',
    }),
    separatorItem,
    h3('All Functions', {
      icon: '/sidebar/functions.svg',
      link: 'reference/',
      class: 'top-level-link',
    }),
    {
      items: Object.entries(
        group(
          globSync('radashi/docs/**/*.mdx').map(file => {
            const name = path.basename(file, '.mdx')
            return {
              label: name,
              link:
                ['reference', path.basename(path.dirname(file)), name].join(
                  '/'
                ) + '/',
            }
          }),
          item => item.link.split('/')[1]
        )
      ).map(
        ([label, items]): SidebarItem => ({
          label: label === 'oop' ? 'OOP' : title(label),
          items: items!,
        })
      ),
    },
  ]
}

function h3(
  label: string,
  opts: {
    icon?: string
    link?: string
    class?: string
    attrs?: Record<string, string>
  } = {}
): SidebarItem {
  return {
    label,
    link: opts.link ?? label.toLowerCase().replace(/\s+/g, '-'),
    attrs: {
      ...opts.attrs,
      class: 'h3' + (opts.class ? ` ${opts.class}` : ''),
      target: opts.link && /^https?:/.test(opts.link) ? '_blank' : undefined,
    },
    icon: opts.icon
      ? {
          src: opts.icon,
          attrs: { fill: 'currentColor' },
        }
      : undefined,
  }
}
