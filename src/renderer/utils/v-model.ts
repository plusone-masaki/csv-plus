import { computed, SetupContext } from 'vue'

export default (key: string, value: unknown, { emit }: SetupContext) => computed({
  get: () => value,
  set: updateValue => emit(`update:${key}`, updateValue),
})
