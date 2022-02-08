import { computed, SetupContext } from 'vue'

export default <M, K extends keyof M>(key: K, props: M, { emit }: SetupContext) => computed({
  get: () => props[key],
  set: updateValue => emit(`update:${key}`, updateValue),
})
