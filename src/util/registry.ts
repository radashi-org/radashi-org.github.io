import { isFunction } from 'radashi'

type RegisterEffect<K, V> = (value: V, key: K) => (() => void) | void

export interface Registry<K, V> {
  has(key: K): boolean
  get(key: K): V | undefined
  set(key: K, value: V): void
  delete(key: K): void
  use(
    key: K,
    options: {
      onRegister?: (value: V) => void
      onUnregister?: (value: V) => void
    }
  ): () => void
  onRegister(key: K, effect: RegisterEffect<K, V>): () => void
  onUnregister(key: K, effect: RegisterEffect<K, V>): () => void
}

export function createRegistry<K, V>(
  options: {
    onRegister?: (value: V, key: K) => void
    onUnregister?: (value: V, key: K) => void
  } = {}
): Registry<K, V> {
  class RegistryRecord {
    0?: V
    _$effects = new Set<RegisterEffect<K, V>>()
    _$destructors?: Set<() => void> = undefined
    _$unregisterEffects?: Set<RegisterEffect<K, V>> = undefined
  }

  const registry = new Map<K, RegistryRecord>()

  return {
    has(key) {
      const record = registry.get(key)
      return record != null && 0 in record
    },
    get(key) {
      const record = registry.get(key)
      return record?.[0]
    },
    set(key, value) {
      options.onRegister?.(value, key)
      const record = registry.get(key)
      if (record) {
        if (record._$destructors) {
          record._$destructors.forEach(destructor => destructor())
          record._$destructors.clear()
        }
        record[0] = value
        record._$effects.forEach(effect => {
          const destructor = effect(value, key)
          if (isFunction(destructor)) {
            record._$destructors ??= new Set()
            record._$destructors.add(destructor)
          }
        })
      } else {
        const record = new RegistryRecord()
        record[0] = value
        registry.set(key, record)
      }
    },
    delete(key) {
      const record = registry.get(key)
      registry.delete(key)

      if (record && 0 in record) {
        const value = record[0]!

        record._$destructors?.forEach(destructor => destructor())
        record._$unregisterEffects?.forEach(effect => effect(value, key))
        options.onUnregister?.(value, key)
      }
    },
    use(key, options = {}) {
      let record = registry.get(key)
      if (record && 0 in record) {
        options.onRegister?.(record[0]!)
      }

      const offRegister =
        options.onRegister && this.onRegister(key, options.onRegister)

      const offUnregister =
        options.onUnregister && this.onUnregister(key, options.onUnregister)

      return () => {
        offRegister?.()
        offUnregister?.()
      }
    },
    onRegister(key: K, effect: RegisterEffect<K, V>) {
      let record = registry.get(key)
      if (!record) {
        record = new RegistryRecord()
        registry.set(key, record)
      }
      record._$effects.add(effect)
      return () => {
        record._$effects.delete(effect)
      }
    },
    onUnregister(key: K, effect: RegisterEffect<K, V>) {
      let record = registry.get(key)
      if (!record) {
        record = new RegistryRecord()
        registry.set(key, record)
      }
      record._$unregisterEffects ??= new Set()
      record._$unregisterEffects.add(effect)
      return () => {
        record._$unregisterEffects!.delete(effect)
      }
    },
  }
}
