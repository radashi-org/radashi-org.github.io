import { existsSync } from 'node:fs'
import path from 'node:path'

interface MarkdownNode {
  type?: string
  url?: string
  children?: MarkdownNode[]
}

interface VFile {
  path?: string
}

type FileExists = (file: string) => boolean

/**
 * Resolve a link in an imported Radashi doc the same way the filesystem does,
 * then map the target MDX file to its generated reference route.
 */
export function rewriteReferenceLink(
  destination: string,
  sourceFile: string,
  fileExists: FileExists = existsSync
): string {
  if (!/^\.\.?\//.test(destination)) {
    return destination
  }

  const docsRoot = findRadashiDocsRoot(sourceFile)
  if (!docsRoot) {
    return destination
  }

  const suffixIndex = destination.search(/[?#]/)
  const relativePath =
    suffixIndex === -1 ? destination : destination.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : destination.slice(suffixIndex)
  const target = path.resolve(path.dirname(sourceFile), relativePath)

  if (!isInside(target, docsRoot)) {
    return destination
  }

  const targetFile = findMdxTarget(target, fileExists)
  if (!targetFile) {
    return destination
  }

  const group = path.basename(path.dirname(targetFile))
  const fn = path.basename(targetFile, '.mdx')
  return `/reference/${group}/${fn}/${suffix}`
}

export function rewriteRadashiReferenceLinks() {
  return (tree: MarkdownNode, file: VFile) => {
    if (!file.path || !findRadashiDocsRoot(file.path)) {
      return
    }

    visitLinks(tree, url => rewriteReferenceLink(url, file.path!))
  }
}

function visitLinks(node: MarkdownNode, rewrite: (url: string) => string) {
  // Definitions cover reference-style Markdown links. Images are intentionally
  // excluded because their relative destinations are assets, not page routes.
  if ((node.type === 'link' || node.type === 'definition') && node.url) {
    node.url = rewrite(node.url)
  }

  node.children?.forEach(child => visitLinks(child, rewrite))
}

function findRadashiDocsRoot(sourceFile: string): string | undefined {
  const normalized = path.resolve(sourceFile)
  const marker = `${path.sep}radashi${path.sep}docs${path.sep}`
  const markerIndex = normalized.lastIndexOf(marker)
  if (markerIndex === -1) {
    return
  }

  return normalized.slice(0, markerIndex + marker.length - 1)
}

function isInside(file: string, directory: string): boolean {
  const relative = path.relative(directory, file)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`)
}

function findMdxTarget(
  target: string,
  fileExists: FileExists
): string | undefined {
  const candidates = path.extname(target)
    ? [target]
    : [`${target}.mdx`, path.join(target, 'index.mdx')]

  return candidates.find(
    candidate => path.extname(candidate) === '.mdx' && fileExists(candidate)
  )
}
