<template lang="pug">
div.toolbar
  div.toolbar__content
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toolbar',
})
</script>

<style lang="sass" scoped>
.toolbar
  border-left: 8px solid

  &__content
    align-items: center
    display: flex
    white-space: nowrap

  &__icon
    align-items: center
    box-sizing: border-box
    display: inline-flex
    height: 44px
    justify-content: center
    letter-spacing: normal
    line-height: 1
    padding: 4px
    position: relative
    text-indent: 0
    user-select: none
    vertical-align: middle
    width: 44px

    &::before
      content: ""
      height: 100%
      left: 0
      position: absolute
      top: 0
      width: 100%

    &.active::before
      background: rgba(0, 0, 0, 0.12) !important

    &:hover::before
      background: rgba(0, 0, 0, 0.08)
</style>
