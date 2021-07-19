<template lang="pug">
div.grid-table
  div(ref="wrapper")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tab } from '@/@types/types'
import useGrid from '@/renderer/components/Grids/composables/useGrid'

export default defineComponent({
  name: 'GridTable',
  props: {
    tab: { type: Object as PropType<Tab>, required: true },
  },
  setup (props, context) {
    const refs = useGrid(props, context)

    return {
      ...refs,
    }
  },
})
</script>

<style lang="sass" scoped>
.grid-table
  box-sizing: border-box
  display: flex
  position: relative
  overflow: hidden
  height: 100%
  width: 100vw
</style>
