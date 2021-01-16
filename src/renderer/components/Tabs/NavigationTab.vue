<template lang="pug">
div.tag(
  :class="{ active }"
  @click.stop="onClick"
)
  span.dirty {{ isDirty ? '*' : ' ' }}
  span.label {{ label || t('tabs.new_tab') }}
  i.close.material-icons(
    @click.stop="onClose"
  )
    | clear
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
} from 'vue'

export default defineComponent({
  name: 'NavigationTab',
  props: {
    active: { type: Boolean as PropType<boolean>, default: false },
    label: { type: String as PropType<string>, required: true },
    isDirty: { type: Boolean as PropType<boolean>, default: false },
  },
  setup (props, { emit }) {
    const methods = {
      onClick: () => emit('click'),
      onClose: () => emit('close'),
    }

    return {
      ...methods,
    }
  },
})
</script>

<style lang="sass" scoped>
.tag
  background: transparent
  border-radius: 4px 4px 0 0
  color: #cccccc
  cursor: pointer
  display: inline-block
  font-size: 14px
  padding: 8px
  user-select: none
  white-space: nowrap

  &.active
    background: rgba(255, 255, 255, 0.33)
    color: aliceblue

  &:not(.active):hover
    background: rgba(255, 255, 255, 0.08)
    color: aliceblue

  .dirty
    display: inline-block
    width: 8px

  .close
    border-radius: 50%
    display: inline-block
    font-size: 16px
    margin: -2px -2px -2px 6px
    padding: 2px
    vertical-align: bottom
    width: 16px

    &:hover
      background: rgba(255, 255, 255, 0.08)
</style>
