<template lang="pug">
div.grid-table
  div(ref="wrapper")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import HandsOnTable from 'handsontable'
import { FileData, Options } from '@/common/types'
import useGrid from '@/renderer/components/Grids/composables/useGrid'
import registerWatchers from '@/renderer/components/Grids/composables/registerWatchers'
import registerListeners from '@/renderer/components/Grids/composables/registerListeners'

export default defineComponent({
  name: 'GridTable',
  props: {
    table: { type: Object as PropType<HandsOnTable|null>, default: null },
    file: { type: Object as PropType<FileData>, required: true },
    options: { type: Object as PropType<Options>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true },
    keyword: { type: String as PropType<string>, required: true },
  },
  setup (props, context) {
    const refs = useGrid(props, context)
    registerWatchers(props, context, refs)
    registerListeners(props)

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
