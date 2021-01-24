<template lang="pug">
label.text-input
  span.text-input__icon
    svg-icon(
      v-if="icon"
      :icon="icon"
      color="rgba(0, 0, 0, 1)"
    )
  input.text-input__input(
    v-model="value"
    :style="{ width: `${width}px` }"
    type="text"
  )
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'TextInput',
  components: { SvgIcon },
  props: {
    modelValue: { type: [String, Number] as PropType<string|number>, required: true },
    icon: { type: String as PropType<string|undefined>, default: undefined },
    placeholder: { type: String as PropType<string|undefined>, default: undefined },
    width: { type: Number as PropType<number>, default: 180 },
  },
  setup: (props, { emit }) => ({
    value: computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    }),
  }),
})
</script>

<style lang="sass" scoped>
.text-input
  background: transparent
  border: thin solid #cfcfcf
  border-radius: 4px
  box-sizing: border-box
  display: inline-flex
  height: 30px
  margin: 0 8px

  &:focus-within
    border-color: dodgerblue

  &__icon
    align-items: center
    background: rgba(207, 207, 207, 1)
    display: inline-flex
    padding: 4px

  &:focus-within &__icon
    background: dodgerblue

  &__input
    background: transparent
    border: none
    color: #cfcfcf
    font-size: 16px
    outline: none !important
    padding: 4px
</style>
