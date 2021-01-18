<template lang="pug">
div.tag(@click.stop="add")
  i.add.material-icons add
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavigationAddTab',
  setup: (props, { emit }) => ({
    add: () => emit('add'),
  }),
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

  &:hover
    background: rgba(255, 255, 255, 0.08)
    color: aliceblue

  .add
    border-radius: 50%
    display: inline-block
    font-size: 16px
    vertical-align: bottom
    width: 16px
</style>
