import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  SetupContext,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/languages/ja-JP'
import sanitize from 'sanitize-html'
import { Search, Tab, Table } from '@/common/types'

const sanitizeOption: SanitizeOption = {
  allowedTags: [],
  allowedAttributes: {},
}

export default (props: { tab: Tab }, context: SetupContext) => {
  const wrapper = ref<HTMLDivElement>()
  const settings = computed((): HandsOnTable.GridSettings => ({
    data: props.tab.options.hasHeader ? props.tab.file.data.slice(1) : props.tab.file.data,
    autoColumnSize: { syncLimit: 10 },
    autoRowSize: false,
    colHeaders: props.tab.options.hasHeader
      ? props.tab.file.data[0].map((d: string) => d ? sanitize(d, sanitizeOption) : '') as string[]
      : true,
    colWidths: props.tab.file.meta.colWidth,
    columnSorting: true,
    contextMenu: true,
    copyPaste: true,
    className: 'htLeft',
    dragToScroll: true,
    filters: true,
    language: 'ja-JP',
    manualColumnResize: true,
    manualRowResize: true,
    minSpareCols: Number(!props.tab.options.printMode),
    minSpareRows: Number(!props.tab.options.printMode),
    outsideClickDeselects: false,
    renderAllRows: props.tab.options.printMode,
    rowHeaders: true,
    rowHeaderWidth: Math.max(50, (props.tab.file.data.length.toString().length * 16)),
    search: true,
    viewportColumnRenderingOffset: props.tab.options.printMode ? props.tab.file.data.length : 'auto',
    viewportRowRenderingOffset: props.tab.options.printMode ? props.tab.file.data.length : 'auto',
    afterChange: (_: unknown, src) => {
      if (!['loadData', 'undo'].includes(src)) context.emit('edit')
    },
    afterSelection: (startRow: number, startCol: number, endRow: number, endCol: number) => {
      if (!props.tab.table) return

      const rowLength = endRow - startRow
      const colLength = endCol - startCol

      const values = props.tab.table.getData(startRow, startCol, endRow, endCol).flat() as string[]
      props.tab.calculation.selected = {
        rowLength,
        colLength,
        summary: (rowLength || colLength) && values.reduce((a, b) => a + Number(b), 0),
      }
    },
  }))

  onMounted(() => {
    if (wrapper.value) {
      const handsOnTable = new HandsOnTable(wrapper.value, settings.value) as Table
      props.tab.table = handsOnTable
      props.tab.options.search.instance = handsOnTable.getPlugin('search') as any as Search
    }
  })

  onBeforeUnmount(() => {
    if (props.tab.table) props.tab.table.destroy()
  })

  return {
    wrapper,
    settings,
  }
}
