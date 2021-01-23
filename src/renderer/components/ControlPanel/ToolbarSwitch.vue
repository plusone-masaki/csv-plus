<template lang="pug">
span.toolbar__icon(
  :class="{ active: modelValue }"
  :title="title"
)
  svg-icon(
    :icon="icon"
    :color="color"
    :size="size"
    @click="onClick"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'ToolbarSwitch',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: Boolean as PropType<boolean>, default: false },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
    title: { type: String as PropType<string|undefined>, default: undefined },
    size: { type: Number as PropType<number>, default: 36 },
  },
  setup: (props, { emit }) => ({
    onClick: () => emit('update:modelValue', !props.modelValue),
  }),
})
</script>

<style lang="sass" scoped>
.toolbar__icon
  align-items: center
  box-sizing: border-box
  display: inline-flex
  justify-content: center
  letter-spacing: normal
  line-height: 1
  padding: 4px
  position: relative
  text-indent: 0
  user-select: none
  vertical-align: middle
  width: 44px

  &.active
    background: rgba(255, 255, 255, 0.12) !important

  &:hover
    background: rgba(255, 255, 255, 0.08)
</style>
