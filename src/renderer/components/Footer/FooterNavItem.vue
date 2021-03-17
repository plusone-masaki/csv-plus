<template lang="pug">
div.footer-nav__item(@click="onClick")
  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterNavItem',
  setup: (props, context) => ({
    onClick: () => context.emit('click'),
  }),
})
</script>

<style lang="sass" scoped>
.footer-nav__item
  font-size: 12px
  padding: 0 8px
  position: relative
  user-select: none
  white-space: nowrap

  &::before
    content: ""
    height: 100%
    position: absolute
    top: 0
    left: 0
    width: 100%

  &:hover::before
    background: rgba(0, 0, 0, 0.08)
</style>
