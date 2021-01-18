<template lang="pug">
input.text-input(v-model="value")
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TextInput',
  props: {
    modelValue: { type: String as PropType<string>, required: true },
  },
  setup (props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    return {
      value,
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
  width: 2em

  &:focus
    border: solid 2px rgba(0, 0, 255, 0.5)
    outline: none
</style>
