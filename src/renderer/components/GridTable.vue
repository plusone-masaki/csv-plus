<template lang="pug">
div#grid-table
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from 'vue'
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
    modelValue: { type: Array, required: true },
  },
  setup (props, { emit }) {
    const csvData = computed<HandsOnTable.CellValue[][]|HandsOnTable.RowObject[]>({
      get: () => props.modelValue as HandsOnTable.CellValue[][]|HandsOnTable.RowObject[],
      set: value => emit('input', value),
    })

    const state: State = reactive({
      table: null,
      settings: {
        data: csvData,
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        language: 'ja-JP',
        licenseKey: 'non-commercial-and-evaluation',
      },
    })

    onMounted(() => {
      const container = document.getElementById('grid-table')
      if (container) {
        state.table = new HandsOnTable(container, state.settings)
      }
    })

    return {
      state,
      csvData,
    }
  },
})
</script>

<style lang="sass" scoped>
#grid-table
  position: relative
</style>
