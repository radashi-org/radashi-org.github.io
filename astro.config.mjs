import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import unocss from '@unocss/astro'
import unocssMini from '@unocss/preset-mini'

// https://astro.build/config
export default defineConfig({
  site: 'https://radashi-org.github.io',
  integrations: [
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
      sidebar: [
        // {
        //   label: 'Guides',
        //   items: [],
        // },
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
          attrs: { class: 'h3 hr-after' },
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
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
      customCss: [
        './src/styles/custom.css',
        './src/styles/light-theme.css',
        './src/styles/dark-theme.css',
      ],
    }),
    unocss({
      presets: [unocssMini()],
    }),
  ],
})
