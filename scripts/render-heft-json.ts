import glob from 'fast-glob'
import { build } from 'esbuild'
import path from 'node:path'

export async function renderHeftJson() {
  const heft: Record<string, number> = {}

  for (const file of glob.sync('radashi/src/*/*.ts').sort()) {
    const name = path.basename(file, '.ts')
    const result = await build({
      entryPoints: [file],
      platform: 'node',
      bundle: true,
      minify: true,
      write: false,
    })
    const sizeInBytes = result.outputFiles[0].contents.length
    heft[name] = sizeInBytes
  }

  return heft
}
