import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'

export function TabbedCodeBlock(props: { names: string[]; children?: any }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const [codeBlocks] = useState(() => [] as HTMLElement[])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [offScreen, setOffScreen] = useState(false)
  const [mousedOver, setMousedOver] = useState(false)

  let [isPaused, setPaused] = useState(true)
  if (offScreen || mousedOver) {
    isPaused = true
  }

  function setCodeBlock(index: number) {
    const previousIndex = currentIndex
    setCurrentIndex(index)
    if (index !== previousIndex && previousIndex !== -1) {
      codeBlocks[previousIndex].style.display = 'none'
    }
    codeBlocks[index].style.removeProperty('display')
  }

  useLayoutEffect(() => {
    const codeContainer = codeContainerRef.current!
    codeContainer.style.removeProperty('display')

    // The first child is always an <astro-slot> element.
    const codeContainerSlot = codeContainer.firstElementChild!

    const afterSiblingLoop: (() => void)[] = []

    let child: Element | null = codeContainerSlot.firstElementChild
    while (child) {
      if (child instanceof HTMLElement && child.matches('.expressive-code')) {
        const preludeSiblings: HTMLElement[] = []

        // Collect all siblings before this child until an .expressive-code
        // is encountered
        let sibling = child.previousElementSibling
        while (sibling && !sibling.matches('.expressive-code')) {
          if (sibling instanceof HTMLElement) {
            preludeSiblings.unshift(sibling)
          }
          sibling = sibling.previousElementSibling
        }

        let codeBlock = child
        afterSiblingLoop.push(() => {
          // If there are prelude elements, clone and append them before the code block
          if (preludeSiblings.length > 0) {
            const codeBlockWrapper = document.createElement('div')
            preludeSiblings.forEach(child => {
              codeBlockWrapper.appendChild(child)
            })
            codeBlock.replaceWith(codeBlockWrapper)
            codeBlockWrapper.append(codeBlock)
            codeBlock = codeBlockWrapper
          }

          codeBlocks.push(codeBlock)

          codeBlock.style.visibility = 'hidden'
          if (codeBlocks.length > 1) {
            codeBlock.style.position = 'absolute'
          }

          codeBlock.addEventListener('mouseenter', () => {
            setMousedOver(true)
          })
          codeBlock.addEventListener('mouseleave', () => {
            setMousedOver(false)
          })
          // Let mobile devices click to pause/play
          codeBlock.addEventListener('click', () => {
            setPaused(paused => !paused)
          })
        })
      }

      child = child.nextElementSibling
    }

    for (const callback of afterSiblingLoop) {
      callback()
    }

    console.log({ names: props.names, codeBlocks })

    if (props.names.length !== codeBlocks.length) {
      console.error(new Error('Number of names and code blocks must match'))
    }

    requestAnimationFrame(function loop() {
      let maxHeight = Infinity
      let shortestBlock = codeBlocks[0]
      for (const codeBlock of codeBlocks) {
        const blockHeight = codeBlock.offsetHeight
        if (blockHeight === 0) {
          return requestAnimationFrame(loop)
        }
        if (blockHeight < maxHeight) {
          maxHeight = blockHeight
          shortestBlock = codeBlock
        }
      }
      codeBlocks.forEach(codeBlock => {
        codeBlock.style.maxHeight = `${maxHeight}px`
        codeBlock.style.overflowY =
          codeBlock !== shortestBlock ? 'scroll' : 'hidden'
        codeBlock.style.display = 'none'

        codeBlock.style.removeProperty('position')
        codeBlock.style.removeProperty('visibility')
      })
      setCodeBlock(0)
      setPaused(false)
    })
  }, [])

  useEffect(() => {
    if (!isPaused) {
      const loop = setTimeout(() => {
        setCodeBlock((currentIndex + 1) % props.names.length)
      }, 5000)

      return () => clearTimeout(loop)
    }
  }, [currentIndex, isPaused])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOffScreen(!entry.isIntersecting)
      },
      {
        rootMargin: '-50% 0px -37% 0px', // 70% of the screen vertically
      }
    )

    observer.observe(rootRef.current!)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef}>
      <div
        class="not-content flex flex-row items-center mt-3"
        onMouseEnter={() => setMousedOver(true)}
        onMouseLeave={() => setMousedOver(false)}>
        {props.names.map((name, index) => (
          <div
            role="button"
            class="relative cursor-pointer px-4 py-0.5 rounded-full"
            onMouseEnter={() => setCodeBlock(index)}
            onClick={() => setCodeBlock(index)}>
            <span class="block text-pink100 font-600 text-0.9rem">{name}</span>
            <div class="absolute left-0 bottom--1 w-full px-3">
              <div
                class={clsx([
                  'h-2.6px w-full rounded-full transition-650',
                  currentIndex === index
                    ? mousedOver
                      ? 'bg-#fffa85'
                      : 'bg-$sl-color-accent'
                    : 'bg-#8a6e6f opacity-50',
                ])}></div>
            </div>
          </div>
        ))}
      </div>
      <div ref={codeContainerRef} style={{ display: 'none' }}>
        {props.children}
      </div>
    </div>
  )
}
