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
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/dist/handsontable.full.min.css'
import 'handsontable/languages/ja-JP'

export default defineComponent({
  name: 'GridTable',
  props: {
    data: { type: Array as PropType<HandsOnTable.CellValue[][] | HandsOnTable.RowObject[]>, required: true },
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
        dropdownMenu: true,
        language: 'ja-JP',
        licenseKey: 'non-commercial-and-evaluation',
        afterChange: (_: HandsOnTable.CellValue[][], src: HandsOnTable.ChangeSource) => {
          if (!['loadData'].includes(src)) emit('edit')
        },
      } as HandsOnTable.GridSettings,
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
  box-sizing: inherit
  position: relative
  overflow: hidden
  height: 100%
  width: 100%
</style>
