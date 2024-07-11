import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import { StarlightUserConfig } from '@astrojs/starlight/types'
import unocss from '@unocss/astro'
import mdAstro from '@astropub/md'
import virtual from 'vite-plugin-virtual'
import exec from '@cush/exec'
import { existsSync, writeFileSync } from 'fs'
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
      title: 'My Docs',
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
        light: './src/assets/radashi-logo@3x.webp',
        dark: './src/assets/radashi-logo-dark@3x.webp',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      editLink: {
        baseUrl: 'https://github.com/radashi-org/radashi/edit/main/docs/',
      },
      sidebar: generateSidebar(),
      customCss: [
        './src/styles/custom.css',
        './src/styles/light-theme.css',
        './src/styles/dark-theme.css',
      ],
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
  writeFileSync('src/content/docs/reference/index.mdx', content)

  return [
    virtual({
      'virtual:radashi/heft': heft,
    }),
  ]
}

function generateSidebar(): SidebarItem[] {
  return [
    {
      label: 'Getting Started',
      link: 'getting-started',
      attrs: { class: 'h3' },
    },
    {
      label: 'Core Concepts',
      link: 'core-concepts',
      attrs: { class: 'h3' },
    },
    {
      label: 'Installation',
      link: 'installation',
      attrs: { class: 'h3' },
      icon: {
        src: '/Install-dark.svg',
        attrs: {
          // width: '24rem',
          // height: '24rem',
          fill: 'currentColor',
        },
      },
    },
    {
      separator: '0.6px solid rgba(240, 240, 240, 0.1)',
    },
    {
      label: 'Lodash Parity',
      link: 'lodash-parity',
      attrs: { class: 'h3' },
    },
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
