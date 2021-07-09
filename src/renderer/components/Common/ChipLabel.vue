<template lang="pug">
div.chip-label
  span.chip-label__content(
    :class="{ large, small, '--active': value }"
    :style="{ backgroundColor: color }"
    :title="title"
  )
    slot
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext } from 'vue'
import vModel from '@/renderer/utils/v-model'

export default defineComponent({
  name: 'ChipLabel',
  props: {
    color: { type: String as PropType<string>, default: undefined },
    small: { type: Boolean as PropType<boolean>, default: false },
    large: { type: Boolean as PropType<boolean>, default: false },
    modelValue: { type: Boolean as PropType<boolean>, default: false },
    title: { type: String as PropType<string|undefined>, default: undefined },
  },
  setup (props, context: SetupContext) {
    return {
      value: vModel('modelValue', props, context),
    }
  },
})
</script>

<style lang="sass" scoped>
.chip-label
  align-items: center
  display: inline-flex
  padding: 1px
  user-select: none

  &__content
    border-radius: 4px
    box-sizing: border-box
    cursor: pointer
    display: flex
    font-size: 14px
    height: 18px
    padding: 2px 8px

    &.large
      border-radius: 8px
      font-size: 16px
      padding: 4px 6px

    &.small
      border-radius: 2px
      font-size: 9px
      height: 14px
      padding: 0 6px
</style>
