import { Icons } from '@astrojs/starlight/icons'
import { codeToHtml } from 'shiki'
import { supabase } from '../../db/client'

export async function viewDocumentation(
  target: HTMLElement,
  pr_number: number,
  name: string
) {
  const rootElem = document.createElement('div')
  rootElem.classList.add('documentation', 'sl-markdown-content', 'color-$white')
  rootElem.innerHTML = Icons['loading']
  target.appendChild(rootElem)

  await Promise.resolve(
    supabase
      .from('proposed_functions')
      .select('documentation')
      .eq('pr_number', pr_number)
      .eq('name', name)
      .single()
  )
    .then(({ data, error }) => {
      console.log({ data, error })
      if (error) throw error
      if (data?.documentation != null) {
        return data.documentation
      }
    })
    .catch(error => {
      console.error('Error fetching documentation:', error)
    })
    .then(html => {
      rootElem.innerHTML = html ?? '<p><em>No documentation available.</em></p>'

      rootElem.querySelectorAll('*').forEach(element => {
        if (element.matches('h1')) {
          return element.remove()
        }

        if (element.matches('pre')) {
          const code = element.querySelector('code')!
          const lang = code.className.match(/\blanguage-(\w+)/)?.[1]
          if (!lang) {
            return
          }

          return codeToHtml(code.textContent!, {
            lang,
            theme: 'github-dark-dimmed',
          }).then(preMarkup => {
            const parser = new DOMParser()
            const preDocument = parser.parseFromString(preMarkup, 'text/html')
            const preElement = preDocument.body.firstChild as HTMLElement
            preElement.style.background = null!
            element.replaceWith(preElement)
          })
        }

        const childNodes = Array.from(element.childNodes)
        childNodes.forEach(childNode => {
          if (childNode.nodeType === Node.TEXT_NODE) {
            const text = childNode.textContent!
            const regex = /\bhttps:\/\/\S+/g

            let lastIndex = 0
            let lastTextNode = childNode

            let match: RegExpExecArray | null
            while ((match = regex.exec(text)) !== null) {
              const url = match[0]

              const linkElement = document.createElement('a')
              linkElement.href = url
              linkElement.textContent = url

              childNode.textContent = text.slice(lastIndex, match.index)
              lastTextNode.after(linkElement)
              lastTextNode = linkElement

              lastIndex = regex.lastIndex
            }

            if (lastIndex !== 0 && lastIndex < text.length) {
              lastTextNode.after(document.createTextNode(text.slice(lastIndex)))
            }
          }
        })
      })
    })
}
