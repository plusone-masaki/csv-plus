import { computed, SetupContext } from 'vue'

export default (key: string, props: { [key: string]: unknown }, { emit }: SetupContext) => computed({
  get: () => props[key],
  set: updateValue => emit(`update:${key}`, updateValue),
})
