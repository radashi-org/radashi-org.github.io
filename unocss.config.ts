import unocssMini from '@unocss/preset-mini'

export default {
  presets: [unocssMini()],
  content: {
    pipeline: {
      include: ['src/pages/**/*.astro'],
      exclude: ['**/node_modules/**'],
    },
  },
}
