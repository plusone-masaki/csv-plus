<template lang="pug">
div.footer-nav-label(
  :class="{ '--active': active }"
  @click="active = !active"
)
  slot
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import vModel from '@/renderer/utils/v-model'

export default defineComponent({
  name: 'FooterNavLabel',
  props: {
    modelValue: { type: Boolean as PropType<boolean>, default: false },
  },
  setup: (props, context) => ({
    active: vModel('modelValue', props, context),
  }),
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
