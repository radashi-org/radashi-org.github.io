import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import { StarlightUserConfig } from '@astrojs/starlight/types'
import unocss from '@unocss/astro'
import mdAstro from '@astropub/md'
import virtual from 'vite-plugin-virtual'
import exec from '@cush/exec'
import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { renderHeftJson } from './scripts/render-heft-json'
import { renderReferenceIndex } from './scripts/render-reference-index'
import { group } from 'radashi'
import glob from 'fast-glob'
import path from 'node:path'
import { camel } from 'radashi'
import { title } from 'radashi'

type SidebarItem = (StarlightUserConfig['sidebar'] & object)[number]

// https://astro.build/config
export default defineConfig({
  site: 'https://radashi-org.github.io',
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
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      editLink: {
        baseUrl: 'https://github.com/radashi-org/radashi/edit/main/docs/',
      },
      expressiveCode: {
        themes: ['starlight-dark'],
      },
      sidebar: generateSidebar(),
      customCss: ['./src/styles/custom.css', './src/styles/dark-theme.css'],
    }),
    unocss(),
  ],
  vite: {
    plugins: [radashi()],
  },
})

async function radashi() {
  console.log('Pulling radashi...')
  if (existsSync('radashi')) {
    await exec('git pull', { cwd: 'radashi', stdio: 'inherit' })
  } else {
    await exec('git clone https://github.com/radashi-org/radashi --depth 1', {
      stdio: 'inherit',
    })
  }

  const heft = await renderHeftJson()

  console.log('Generating API reference index page...')
  const content = await renderReferenceIndex()
  mkdirSync('src/content/docs/reference', { recursive: true })
  writeFileSync('src/content/docs/reference/index.mdx', content)

  return [
    virtual({
      'virtual:radashi/heft': heft,
    }),
  ]
}

function generateSidebar(): SidebarItem[] {
  return [
    h3('Introduction'),
    h3('Installation'),
    h3('Our Ethos'),
    h3('Contributing'),
    h3('Browser Support'),
    h3('Lodash Parity'),
    {
      separator: '0.6px solid rgba(240, 240, 240, 0.1)',
    },
    h3('Community', {
      icon: '/Community-dark.svg',
      link: 'https://github.com/orgs/radashi-org/discussions',
    }),
    h3('Github', {
      icon: '/Github-dark.svg',
      link: 'https://github.com/radashi-org/radashi',
    }),
    h3('NPM', {
      icon: '/Npm-dark.svg',
      link: 'https://www.npmjs.com/package/radashi',
    }),
    h3('JSR.io', {
      icon: '/JSR-dark.svg',
      link: 'https://jsr.io/@radashi-org/radashi',
    }),
    {
      separator: '0.6px solid rgba(240, 240, 240, 0.1)',
    },
    h3('All Functions', {
      link: 'reference/',
    }),
    {
      items: Object.entries(
        group(
          glob.sync('radashi/docs/**/*.mdx').map(file => {
            const name = path.basename(file, '.mdx')
            return {
              label: camel(name),
              link: ['reference', path.basename(path.dirname(file)), name].join(
                '/'
              ),
            }
          }),
          item => item.link.split('/')[1]
        )
      ).map(
        ([label, items]): SidebarItem => ({
          label: title(label),
          items: items!,
        })
      ),
    },
  ]
}

function h3(
  label: string,
  opts: { icon?: string; link?: string } = {}
): SidebarItem {
  return {
    label,
    link: opts.link ?? label.toLowerCase().replace(/\s+/g, '-'),
    attrs: {
      class: 'h3',
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
