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
      target: 'node18',
      bundle: true,
      write: false,
      minify: true,
      format: 'esm',
    })
    const content = Buffer.from(result.outputFiles[0].contents).toString('utf8')
    const sizeInBytes = Buffer.byteLength(content)
    heft[name] = sizeInBytes
  }

  return heft
}
