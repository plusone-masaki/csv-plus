<template lang="pug">
div.grid-table
  div(ref="wrapper")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import HandsOnTable from 'handsontable'
import { Options } from '@/renderer/types'
import useRefs from '@/renderer/components/Grids/composables/useRefs'
import registerWatchers from '@/renderer/components/Grids/composables/registerWatchers'
import registerListeners from '@/renderer/components/Grids/composables/registerListeners'

export default defineComponent({
  name: 'GridTable',
  props: {
    data: { type: Array as PropType<HandsOnTable.CellValue[][] | HandsOnTable.RowObject[]>, required: true },
    options: { type: Object as PropType<Options>, required: true },
    path: { type: String as PropType<string>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true },
  },
  setup (props, context) {
    const refs = useRefs(props, context)
    registerWatchers(props, context, refs)
    registerListeners(props, context, refs)

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
