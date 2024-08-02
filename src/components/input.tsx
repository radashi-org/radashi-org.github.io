import { type JSX } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { type Channel, defineChannel, dispatch } from '../util/channel'
import { createRegistry } from '../util/registry'

/**
 * Contains every {@link InputState} element that is currently in the DOM.
 */
const InputRegistry = createRegistry<string, InputState>()

/**
 * Returns the {@link InputState} for the input with the given name.
 *
 * If not yet registered, returns `null` and waits for it to be registered.
 * Once registered, your component is rerendered.
 */
export function useInputByName(name: string) {
  const [state, setState] = useState(InputRegistry.get(name) ?? null)

  useEffect(() => {
    return InputRegistry.use(name, {
      onRegister: setState,
      onUnregister: () => setState(null),
    })
  }, [name])

  return state
}

export interface InputState {
  name: string
  element: HTMLInputElement
  events: Channel<{
    input: InputEvent
  }>
}

export function Input(
  props: JSX.IntrinsicElements['input'] & { name: string }
) {
  const state = useMemo(
    (): InputState => ({
      name: props.name,
      element: null!,
      events: defineChannel(),
    }),
    [props.name]
  )
  return (
    <input
      {...props}
      ref={element => {
        if (element) {
          InputRegistry.set(state.name, { ...state, element })
        } else {
          InputRegistry.delete(state.name)
        }
      }}
      onInput={event => {
        props.onInput?.(event)
        dispatch(state.events, 'input', event)
      }}
    />
  )
}
