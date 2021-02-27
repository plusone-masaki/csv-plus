<template lang="pug">
div.tab(@click.stop="add")
  span.add
    SvgIcon(:size="16" icon="add")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'NavigationAddTab',
  components: {
    SvgIcon,
  },
  setup: (props, context) => ({
    add: () => context.emit('add'),
  }),
})
</script>

<style lang="sass" scoped>
.tab
  align-items: center
  background: transparent
  display: inline-flex
  font-size: 14px
  padding: 4px 8px
  user-select: none
  white-space: nowrap

  &:hover
    background: rgba(255, 255, 255, 0.08)
    color: aliceblue
    fill: aliceblue

  .add
    border-radius: 50%
    display: inline-flex
    height: 16px
    font-size: 16px
    vertical-align: middle
    width: 16px
</style>
