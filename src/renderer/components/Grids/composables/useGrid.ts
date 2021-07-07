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
import { Tab, TableInstance } from '@/common/types'
import Search from '@/renderer/models/Search'
import gridHooks from '@/renderer/components/Grids/composables/gridHooks'

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
    ...gridHooks(props, context),
  }))

  onMounted(() => {
    if (wrapper.value) {
      const handsOnTable = new HandsOnTable(wrapper.value, settings.value) as TableInstance
      props.tab.table.instance = handsOnTable
      props.tab.table.search = Search(handsOnTable)
    }
  })

  onBeforeUnmount(() => {
    if (props.tab.table.instance) props.tab.table.instance.destroy()
  })

  return {
    wrapper,
    settings,
  }
}
