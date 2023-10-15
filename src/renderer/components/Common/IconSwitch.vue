<template lang="pug">
span.icon-btn(
  :class="{ active: modelValue === value }"
  :title="title"
  @click="onClick"
)
  svg-icon(
    :icon="icon"
    :color="color"
    :size="size"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'IconSwitch',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: [String, Number, Boolean] as PropType<string|number|boolean>, default: false },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
    title: { type: String as PropType<string|undefined>, default: undefined },
    size: { type: [String, Number] as PropType<number>, default: 24 },
    value: { type: [String, Number, Boolean] as PropType<string|number|boolean>, default: true },
  },
  setup: (props, { emit }) => ({
    onClick: () => emit('update:modelValue', typeof props.modelValue === 'boolean' ? !props.modelValue : props.value),
  }),
})
</script>

<style lang="sass" scoped>
.icon-btn
  align-items: center
  box-sizing: border-box
  display: inline-flex
  justify-content: center
  letter-spacing: normal
  line-height: 1
  padding: 2px
  position: relative
  text-indent: 0
  user-select: none
  vertical-align: middle

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
