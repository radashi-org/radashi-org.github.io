import { useEffect } from 'preact/hooks'

const kChannelSymbol = Symbol('channel')

export interface Channel<T extends EventTypeMap> {
  readonly [kChannelSymbol]: EventTarget & { __events?: T }
}

export function defineChannel<T extends EventTypeMap>(): Channel<T> {
  return { [kChannelSymbol]: new EventTarget() }
}

export function dispatch<T extends EventTypeMap, TEvent extends string>(
  channel: Channel<T>,
  type: TEvent,
  event: EventForType<TEvent, T> extends infer Event
    ? Event extends never
      ? never
      : Event | (Event extends CustomEvent<infer TDetail> ? TDetail : never)
    : never
): void

export function dispatch<TEvents extends EventTypeMap, TEvent extends string>(
  channel: Channel<TEvents>,
  type: TEvent,
  event: unknown
) {
  channel[kChannelSymbol].dispatchEvent(
    new CustomEvent(type, { detail: event })
  )
}

export function useChannel<TEvents extends EventTypeMap, TEvent extends string>(
  channel: Channel<TEvents> | null | undefined,
  type: TEvent,
  listener: (event: EventForType<TEvent, TEvents>) => void,
  deps: readonly any[] = []
) {
  useEffect(() => {
    if (!channel) {
      return
    }
    const handler = (event: any) => {
      if (event.detail && event.detail instanceof Event) {
        event = event.detail
      }
      listener?.(event)
    }
    channel[kChannelSymbol].addEventListener(type, handler)
    return () => channel[kChannelSymbol].removeEventListener(type, handler)
  }, [...deps, channel, type])
}

interface EventTypeMap {
  [type: string]: Event
}

type EventForType<
  TEvent extends string,
  TEvents extends EventTypeMap,
> = TEvent extends keyof TEvents ? TEvents[TEvent] : never
