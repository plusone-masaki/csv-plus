import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  SetupContext,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/languages/ja-JP'
import { Props } from './types'

export default (props: Props, context: SetupContext) => {
  const wrapper = ref<HTMLDivElement>()
  const search = ref<HandsOnTable.plugins.Search|null>(null)
  const settings = computed((): HandsOnTable.GridSettings => ({
    data: props.options.hasHeader ? props.file.data.slice(1) : props.file.data,
    autoColumnSize: { syncLimit: 10 },
    autoRowSize: false,
    colHeaders: props.options.hasHeader ? props.file.data[0] as string[] : true,
    columnSorting: true,
    contextMenu: true,
    copyPaste: true,
    className: 'htLeft',
    dragToScroll: true,
    filters: true,
    language: 'ja-JP',
    manualColumnResize: true,
    manualRowResize: true,
    minSpareCols: Number(!props.options.printMode),
    minSpareRows: Number(!props.options.printMode),
    outsideClickDeselects: false,
    renderAllRows: props.options.printMode,
    rowHeaders: true,
    rowHeaderWidth: Math.max(50, (props.file.data.length.toString().length * 16)),
    search: true,
    viewportColumnRenderingOffset: props.options.printMode ? props.file.data.length : 'auto',
    viewportRowRenderingOffset: props.options.printMode ? props.file.data.length : 'auto',
    afterChange: (_: unknown, src) => {
      if (!['loadData'].includes(src)) context.emit('edit')
    },
    afterSelection: (startRow: number, startCol: number, endRow: number, endCol: number) => {
      if (!props.table) return

      const rowLength = endRow - startRow
      const colLength = endCol - startCol

      const values = props.table.getData(startRow, startCol, endRow, endCol).flat() as string[]
      props.calculation.selected = {
        rowLength,
        colLength,
        summary: (rowLength || colLength) && values.reduce((a, b) => a + Number(b), 0),
      }
    },
  }))

  onMounted(() => {
    if (wrapper.value) {
      const handsOnTable = new HandsOnTable(wrapper.value, settings.value)
      search.value = handsOnTable.getPlugin('search')
      context.emit('load', handsOnTable)
    }
  })

  onBeforeUnmount(() => {
    if (props.table) props.table.destroy()
  })

  return {
    wrapper,
    search,
    settings,
  }
}
