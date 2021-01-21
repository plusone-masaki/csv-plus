<template lang="pug">
span.chip-item(:style="style")
  span.chip-item__content
  slot
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChipItem',
  props: {
    color: { type: String as PropType<string>, default: '#e0e0e0' },
    dark: { type: Boolean as PropType<boolean>, default: false },
    outlined: { type: Boolean as PropType<boolean>, default: false },
  },
  setup (props) {
    const style = computed(() => ({
      background: props.outlined ? 'transparent' : props.color,
      border: props.outlined ? `thin solid ${props.color}` : undefined,
      color: props.dark ? '#fefefe' : '#333333',
    }))

    return {
      style,
    }
  },
})
</script>

<style lang="sass" scoped>
.chip-item
  align-items: center
  border-radius: 6px
  cursor: pointer
  display: inline-flex
  height: 16px
  font-size: 10px
  line-height: 20px
  padding: 0 8px
  position: relative
  user-select: none
  vertical-align: middle
  white-space: nowrap

  &__content
    align-items: center
    display: inline-flex
    height: 100%
    max-width: 100%

  &::before
    bottom: 0
    border: thin solid transparent
    border-radius: 4px
    content: ""
    left: 0
    position: absolute
    pointer-events: none
    right: 0
    top: 0

  &:hover::before
    background: rgba(0, 0, 0, 0.08)

  &:active::before
    background: rgba(0, 0, 0, 0.23)
</style>
