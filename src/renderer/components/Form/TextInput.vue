<template lang="pug">
label.text-input(:style="{ height: `${height}px` }")
  span.text-input__icon(v-if="icon")
    svg-icon(
      :icon="icon"
      color="rgba(0, 0, 0, 1)"
    )
  input.text-input__input(
    v-model="value"
    v-bind="$attrs"
    :placeholder="placeholder"
    :style="{ width: `${width}px` }"
    type="text"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import vModel from '@/renderer/utils/v-model'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'TextInput',
  components: { SvgIcon },
  props: {
    modelValue: { type: [String, Number] as PropType<string|number>, required: true },
    icon: { type: String as PropType<string|undefined>, default: undefined },
    placeholder: { type: String as PropType<string|undefined>, default: undefined },
    height: { type: [Number, String] as PropType<number|string>, default: 28 },
    width: { type: [Number, String] as PropType<number|string>, default: 180 },
  },
  setup: (props, context) => ({
    value: vModel('modelValue', props, context),
  }),
  inheritAttrs: true,
})
</script>

<style lang="sass" scoped>
.text-input
  background: rgba(255, 255, 255, 0.67)
  border: thin solid #cfcfcf
  box-sizing: border-box
  display: inline-flex
  margin: 0

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
    outline: none !important
    padding: 4px
</style>
