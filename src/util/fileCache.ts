import fs from 'node:fs'
import path from 'node:path'

export async function cachedToFile<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const cachePath = `./.cache/${name}.json`
  try {
    const cache = fs.readFileSync(cachePath, 'utf-8')
    const cacheMtime = fs.statSync(cachePath).mtime
    const expiryTime = 1000 * 60 * 60 * 24 // 24 hours
    if (Date.now() - cacheMtime.getTime() < expiryTime) {
      return JSON.parse(cache) as T
    }
  } catch {}

  const data = await fn()
  fs.mkdirSync(path.dirname(cachePath), { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(data))
  return data
}
