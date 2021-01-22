<template lang="pug">
span.toolbar-icon(
  :class="{ active: modelValue }"
)
  svg-icon(
    :icon="icon"
    :color="color"
    :size="36"
    @click="onClick"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'ToolbarIcon',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: Boolean as PropType<boolean>, default: false },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
  },
  setup: (props, { emit }) => ({
    onClick: () => emit('update:modelValue', !props.modelValue),
  }),
})
</script>

<style lang="sass" scoped>
.toolbar-icon
  align-items: center
  display: inline-flex
  justify-content: center
  letter-spacing: normal
  line-height: 1
  padding: 4px
  position: relative
  text-indent: 0
  user-select: none
  vertical-align: middle

  &.active
    background: rgba(255, 255, 255, 0.12) !important

  &:hover
    background: rgba(255, 255, 255, 0.08)
</style>
