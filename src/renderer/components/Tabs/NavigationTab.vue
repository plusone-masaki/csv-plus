<template lang="pug">
div.tab(
  :class="{ active }"
  @click.stop="onClick"
)
  span.dirty {{ isDirty ? '*' : ' ' }}
  span.label {{ label || t('tabs.new_tab') }}
  span.close
    svg-icon(
      :size="16"
      icon="close"
      @click.stop="onClose"
    )
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
} from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'NavigationTab',
  components: {
    SvgIcon,
  },
  props: {
    active: { type: Boolean as PropType<boolean>, default: false },
    label: { type: String as PropType<string>, required: true },
    isDirty: { type: Boolean as PropType<boolean>, default: false },
  },
  setup (props, { emit }) {
    return {
      onClick: () => emit('click'),
      onClose: () => emit('close'),
    }
  },
})
</script>

<style lang="sass" scoped>
.tab
  background: transparent
  color: #cccccc
  display: inline-block
  font-size: 14px
  fill: #cccccc
  padding: 4px
  user-select: none
  white-space: nowrap

  &.active
    background: rgba(255, 255, 255, 0.33)
    color: aliceblue
    fill: aliceblue

  &:not(.active):hover
    background: rgba(255, 255, 255, 0.08)
    color: aliceblue
    fill: aliceblue

  .dirty
    display: inline-block
    width: 12px

  .close
    border-radius: 50%
    display: inline-block
    height: 16px
    margin-left: 4px
    padding: 2px
    vertical-align: middle
    width: 16px

    &:hover
      background: rgba(255, 255, 255, 0.08)
</style>
