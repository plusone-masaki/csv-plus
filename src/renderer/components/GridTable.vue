<template lang="pug">
div#grid-table
  div#grid-table__content
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  reactive,
  onMounted,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/dist/handsontable.full.min.css'
import 'handsontable/languages/ja-JP'

type State = {
  table: HandsOnTable|null;
  settings: HandsOnTable.GridSettings;
}

export default defineComponent({
  name: 'GridTable',
  props: {
    data: { type: Array as PropType<HandsOnTable.CellValue[][] | HandsOnTable.RowObject[]>, required: true },
    tab: { type: String as PropType<string>, required: true },
  },
  setup (props) {
    const state: State = reactive({
      table: null,
      settings: {
        data: props.data,
        colHeaders: true,
        rowHeaders: true,
        manualColumnResize: true,
        manualRowResize: true,
        filters: true,
        dropdownMenu: true,
        language: 'ja-JP',
        licenseKey: 'non-commercial-and-evaluation',
      },
    })

    watch(() => props.tab, () => {
      if (state.table) state.table.loadData(props.data)
    })

    onMounted(() => {
      const container = document.getElementById('grid-table__content')
      if (container) state.table = new HandsOnTable(container, state.settings)
    })

    return {
      state,
    }
  },
})
</script>

<style lang="sass" scoped>
#grid-table
  box-sizing: inherit
  position: relative
  overflow: hidden
  height: 100%
  width: 100%
</style>
