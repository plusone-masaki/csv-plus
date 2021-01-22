<template lang="pug">
div.grid-table
  div(ref="gridTable")
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/languages/ja-JP'

export default defineComponent({
  name: 'GridTable',
  props: {
    data: { type: Array as PropType<HandsOnTable.CellValue[][] | HandsOnTable.RowObject[]>, required: true },
    headers: { type: Array as PropType<Array<string|number>|null>, default: null },
    path: { type: String as PropType<string>, required: true },
  },
  setup (props, { emit }) {
    const refs = {
      gridTable: ref<HTMLDivElement>(),
    }

    const state = reactive({
      table: null as HandsOnTable|null,
      settings: {
        data: props.data,
        colHeaders: true,
        rowHeaders: true,
        manualColumnResize: true,
        manualRowResize: true,
        filters: true,
        copyPaste: true,
        contextMenu: true,
        dragToScroll: true,
        language: 'ja-JP',
        licenseKey: 'non-commercial-and-evaluation',
        afterChange: (_: unknown, src: HandsOnTable.ChangeSource) => {
          if (!['loadData'].includes(src)) emit('edit')
        },
      } as HandsOnTable.GridSettings,
    })

    watch(() => props.path, () => {
      if (state.table) state.table.loadData(props.data)
    })

    onMounted(() => {
      if (refs.gridTable.value) {
        state.table = new HandsOnTable(refs.gridTable.value, state.settings)
      }
    })

    return {
      state,
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
