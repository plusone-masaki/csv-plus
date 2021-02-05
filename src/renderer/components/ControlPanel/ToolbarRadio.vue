<template lang="pug">
label.toolbar__icon(
  :class="{ active: modelValue === value }"
  :title="title"
)
  input.hidden(
    v-model="checked"
    :value="value"
    type="radio"
  )
  svg-icon(
    :icon="icon"
    :color="color"
    :size="size"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import vModel from '@/renderer/utils/v-model'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'ToolbarRadio',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: [Boolean, String] as PropType<boolean|string>, default: false },
    value: { type: String as PropType<string>, required: true },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
    title: { type: String as PropType<string|undefined>, default: undefined },
    size: { type: [String, Number] as PropType<string|number>, default: 36 },
  },
  setup: (props, context) => ({
    checked: vModel('modelValue', props.modelValue, context),
  }),
})
</script>

<style lang="sass" scoped>
.toolbar__icon
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

  &.active
    background: rgba(255, 255, 255, 0.12) !important

  &:hover
    background: rgba(255, 255, 255, 0.08)
</style>
