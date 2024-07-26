import unocssMini from '@unocss/preset-mini'

export default {
  presets: [unocssMini()],
  content: {
    pipeline: {
      include: [
        'src/components/**/*.astro',
        'src/pages/**/*.astro',
        'src/content/**/*.mdx',
      ],
      exclude: ['**/node_modules/**'],
    },
  },
}
