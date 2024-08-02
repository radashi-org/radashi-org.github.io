export function cloneEvent<T extends Event>(event: T): T {
  const Constructor = event.constructor as typeof Event
  const clone: any = new Constructor(event.type, event)
  return clone
}
