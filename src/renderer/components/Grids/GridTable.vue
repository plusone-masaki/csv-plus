<template lang="pug">
div.grid-table
  div(ref="gridTable")
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  PropType,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/languages/ja-JP'
import { Options } from '@/renderer/types'

export default defineComponent({
  name: 'GridTable',
  props: {
    data: { type: Array as PropType<HandsOnTable.CellValue[][] | HandsOnTable.RowObject[]>, required: true },
    options: { type: Object as PropType<Options>, default: false },
    path: { type: String as PropType<string>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true },
  },
  setup (props, { emit }) {
    const refs = {
      gridTable: ref<HTMLDivElement>(),
      table: ref<HandsOnTable|null>(null),
    }

    const settings = computed((): HandsOnTable.GridSettings => ({
      data: props.options.hasHeader ? props.data.slice(1) : props.data,
      colHeaders: props.options.hasHeader ? props.data[0] as string[] : true,
      columnSorting: true,
      contextMenu: true,
      copyPaste: true,
      dragToScroll: true,
      filters: true,
      language: 'ja-JP',
      licenseKey: 'non-commercial-and-evaluation',
      manualColumnResize: true,
      manualRowResize: true,
      minSpareCols: 1,
      minSpareRows: 1,
      rowHeaders: true,
      search: true,
      afterChange: (_: unknown, src: HandsOnTable.ChangeSource) => {
        if (!['loadData'].includes(src)) emit('edit')
      },
    }))

    watch(() => props.path, () => {
      if (refs.table.value) refs.table.value.loadData(props.data)
    })

    watch(() => props.active, active => {
      if (active && refs.table.value) refs.table.value.render()
    })

    watch(() => settings.value, setting => {
      if (refs.table.value) refs.table.value.updateSettings(setting)
    })

    onMounted(() => {
      if (refs.gridTable.value) {
        refs.table.value = new HandsOnTable(refs.gridTable.value, settings.value)
      }
    })

    return {
      settings,
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
