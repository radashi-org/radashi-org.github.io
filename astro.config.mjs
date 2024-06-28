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
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    unocss({
      presets: [unocssMini()],
    }),
  ],
})
