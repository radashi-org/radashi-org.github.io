import { useState } from 'preact/hooks'
import { Icon } from '../../components/icon'
import { formatRelativeElapsedTime } from '../../util/time'
import { viewDocumentation } from './documentation'

type PrStatus = 'draft' | 'open' | 'closed' | 'merged'

export interface OpenLibraryItem {
  name: string
  group: string
  pr_number: number
  description: string | null
  committed_at: string | null
  approval_rating: number
  breaking: boolean
  checks_passed: boolean | null
  status: PrStatus
  pr_author: { login: string; avatar_url: string } | null
}

export function OpenLibraryItem({ item }: { item: OpenLibraryItem }) {
  const [state] = useState(() => ({
    docsOpened: false,
  }))

  return (
    <div
      role="listitem"
      onClick={event => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest('.documentation, a[href]')
        ) {
          return
        }
        if (state.docsOpened) {
          const docElement = event.currentTarget.querySelector('.documentation')
          if (docElement) {
            docElement.remove()
          }
          state.docsOpened = false
        } else {
          viewDocumentation(event.currentTarget, item.pr_number, item.name)
          state.docsOpened = true
        }
      }}
      class="func-list-item block px-7 py-5 rounded-2 border-1 border-solid border-$gray-border cursor-pointer">
      <div class="mb--1">
        <span class="func-group color-$gray-dim">{item.group}/</span>
      </div>
      <strong class="func-name text-1.4rem font-600">{item.name}</strong>
      <a
        href={`https://github.com/radashi-org/radashi/pull/${item.pr_number}`}
        target="_blank"
        class="no-underline color-$gray-dim hover:color-$white transition-450 transition-color">
        <span title="Click to view PR on GitHub." class="pr-number ml-2 mr-1.5">
          #{item.pr_number}
        </span>
      </a>
      <div class="inline-flex align--9% justify-center">
        {item.checks_passed ? (
          <div
            title="This PR has passed checks. All code is tested."
            class="cursor-default">
            <Icon name="octicon-check" class="h-4.6 w-4.6 color-green400" />
          </div>
        ) : (
          <div title="This PR has failed checks." class="cursor-default">
            <Icon name="octicon-x" class="h-4.6 w-4.6 color-red400" />
          </div>
        )}
      </div>
      {item.description && <p class="description">{item.description}</p>}
      <div class="flex flex-row items-center gap-4 mt-1.4 text-0.95rem">
        {item.pr_author && (
          <div class="flex flex-row items-center self-stretch">
            <img
              src={item.pr_author.avatar_url}
              alt={item.pr_author.login}
              class="w-4 h-4 rounded-1"
            />
            <span class="text-0.95rem font-550 ml-1.6">
              {item.pr_author.login}
            </span>
          </div>
        )}
        {item.committed_at && (
          <span
            title={
              'Last updated ' + new Date(item.committed_at).toLocaleDateString()
            }
            class="commit-date text-$gray cursor-default">
            {formatRelativeElapsedTime(
              Date.now() - new Date(item.committed_at).getTime()
            )}
          </span>
        )}
        {item.breaking && (
          <div
            title="This PR contains a breaking change."
            class="breaking flex justify-center cursor-default">
            <Icon name="danger" class="h-5.6 w-5.6 color-#f8a671" />
          </div>
        )}
        {item.status === 'draft' && (
          <div
            title="This PR is a draft. It may be incomplete."
            class="draft flex justify-center cursor-default">
            <Icon name="bean" class="h-5 w-5 color-#a1c39e" />
          </div>
        )}
        {item.approval_rating > 0 && (
          <div class="flex flex-row items-center">
            <Icon name="thumbup" class="h-4.6 w-4.6 color-$gray mr-2" />
            <span class="approval-rating text-$gray font-550">
              {item.approval_rating}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
