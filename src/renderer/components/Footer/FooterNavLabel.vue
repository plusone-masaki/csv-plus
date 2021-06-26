<template lang="pug">
div.footer-nav-label(:class="{ '--active': value }")
  | {{ label }}
  span(v-show="value")
    slot
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FooterNavLabel',
  props: {
    value: { type: Boolean as PropType<boolean>, default: false },
    label: { type: String as PropType<string>, required: true },
  },
})
</script>

<style lang="sass" scoped>
.footer-nav-label
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
</style>
