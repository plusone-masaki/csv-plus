<template lang="pug">
label.text-input(:style="{ height: `${height}px` }")
  span.text-input__icon(v-if="icon")
    svg-icon(
      :icon="icon"
      :size="height - 8"
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
  padding: 2px

  &:focus-within
    border-color: dodgerblue

  &__icon
    align-items: center
    background: transparent
    display: inline-flex

  &:focus-within &__icon
    color: darken(dodgerblue, 15%) !important
    fill: darken(dodgerblue, 15%) !important

  &__input
    background: transparent
    border: none
    outline: none !important
</style>
