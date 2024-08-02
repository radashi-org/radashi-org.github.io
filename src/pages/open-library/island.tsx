import { type JSX } from 'preact'
import { Input } from '../../components/input'
import type { OpenLibraryItem } from './item'
import { OpenLibraryResults } from './results'

export function OpenLibraryIsland({
  items,
  ...props
}: JSX.IntrinsicElements['div'] & { items: OpenLibraryItem[] }) {
  return (
    <div {...props}>
      <Input name="open-library:search" type="search" placeholder="Search..." />
      <OpenLibraryResults
        class="search-results not-content flex flex-col gap-5 mt-5"
        items={items}
      />
    </div>
  )
}
