import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'

export function TabbedCodeBlock(props: { names: string[]; children?: any }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const [codeBlocks] = useState(() => [] as HTMLElement[])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [offScreen, setOffScreen] = useState(false)

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

    let child: Element | null = codeContainerSlot.firstElementChild
    while (child) {
      console.log(child)
      if (child instanceof HTMLElement && child.matches('.expressive-code')) {
        codeBlocks.push(child)

        child.style.visibility = 'hidden'
        if (codeBlocks.length > 1) {
          child.style.position = 'absolute'
        }

        child.addEventListener('mouseenter', () => {
          setPaused(true)
        })
        child.addEventListener('mouseleave', () => {
          setPaused(false)
        })
        // Let mobile devices click to pause/play
        child.addEventListener('click', () => {
          setPaused(paused => !paused)
        })
      }
      child = child.nextElementSibling
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

  const [isPaused, setPaused] = useState(true)
  useEffect(() => {
    if (!isPaused) {
      const loop = setTimeout(() => {
        setCodeBlock((currentIndex + 1) % props.names.length)
      }, 3000)

      return () => clearTimeout(loop)
    }
  }, [currentIndex, isPaused])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOffScreen(!entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '-15% 0px -15% 0px', // 70% of the screen vertically
        threshold: 0,
      }
    )

    if (rootRef.current) {
      observer.observe(rootRef.current)
    }

    return () => observer.disconnect()
  }, [])

  let paused = isPaused
  if (offScreen) {
    paused = true
  }

  return (
    <div ref={rootRef}>
      <div
        class="not-content flex flex-row items-center mt-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
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
                  'h-2.6px w-full rounded-full transition-250',
                  currentIndex === index
                    ? 'bg-$sl-color-accent'
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
