<template lang="pug">
input.text-input(
  v-model="value"
  :style="style"
)
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TextInput',
  props: {
    modelValue: { type: String as PropType<string>, required: true },
    width: { type: String, default: 'auto' },
  },
  setup (props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    const style = {
      width: props.width,
    }

    return {
      value,
      style,
    }
  },
})
</script>

<style lang="sass" scoped>
.text-input
  background: #cfcfcf
  border: 2px solid #666
  border-radius: 4px
  box-sizing: border-box
  padding: 4px

  &:focus
    border: solid 2px rgba(0, 0, 255, 0.5)
    outline: none
</style>
