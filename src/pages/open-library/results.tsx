import algoliasearch from 'algoliasearch/lite'
import { type JSX } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useInputByName } from '../../components/input'
import { useChannel } from '../../util/channel'
import { OpenLibraryItem } from './item'

export function OpenLibraryResults({
  items: originalItems,
  ...props
}: JSX.IntrinsicElements['div'] & {
  items: OpenLibraryItem[]
}) {
  const search = useInputByName('open-library:search')
  const [items, setItems] = useState(originalItems)
  const [index] = useState(createSearchIndex)

  function refreshItems(text: string) {
    if (text !== '') {
      index.search(text).then(setItems)
    } else {
      setItems(originalItems)
    }
  }

  useEffect(() => {
    if (search) {
      search.element.value = decodeURIComponent(location.hash.slice(1))
      refreshItems(search.element.value)
    }
  }, [search])

  useChannel(search?.events, 'input', event => {
    const text = (event.target as HTMLInputElement).value
    const encodedText = encodeURIComponent(text)
    const newLocation =
      location.pathname + (encodedText.length ? '#' + encodedText : '')

    history.replaceState(null, '', newLocation)
    refreshItems(text)
  })

  return (
    <div {...props}>
      {items.map(item => (
        <OpenLibraryItem item={item} />
      ))}
    </div>
  )
}

interface SearchResult {
  group: string
  name: string
  pr_number: number
  pr_author: OpenLibraryItem['pr_author']
  description: string | null
  committed_at: string | null
  approval_rating: number
  breaking: boolean
  checks_passed: boolean
  status: OpenLibraryItem['status']
}

function createSearchIndex() {
  const client = algoliasearch('7YYOXVJ9K7', '7d9a76e671047bd60cf02883dc773861')
  const index = client.initIndex('proposed_functions')

  async function search(text: string) {
    if (!text) {
      return []
    }

    try {
      const { hits } = await index.search<SearchResult>(text, {
        hitsPerPage: 10,
        attributesToRetrieve: [
          'group',
          'name',
          'pr_number',
          'pr_author',
          'description',
          'committed_at',
          'approval_rating',
          'breaking',
          'checks_passed',
          'status',
        ],
      })

      return hits
    } catch (error) {
      console.error('Error searching Algolia:', error)
      return []
    }
  }

  return {
    search,
  }
}
