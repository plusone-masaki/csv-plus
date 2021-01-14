<template lang="pug">
div.tag(
  :class="{ active }"
  @click.stop="onClick"
)
  | {{ isDirty ? '*' : '' }} {{ label || t('tabs.new_tab') }}
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
  border-radius: 10px 10px 0 0
  color: #cccccc
  display: inline-block
  padding: 8px 16px
  transition: .2s ease
  user-select: none

  &.active
    background: #666
    color: aliceblue

  &:not(.active):hover
    background: rgba(255, 255, 255, 0.08)
    color: aliceblue
</style>
