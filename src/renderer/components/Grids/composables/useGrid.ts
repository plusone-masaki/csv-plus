import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  SetupContext,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import 'handsontable/languages/ja-JP'
import sanitize from 'sanitize-html'
import { Tab } from '@/@types/types'
import { TableInstance } from '@/@types/handsontable'
import Search from '@/renderer/plugins/Search'
import gridHooks from '@/renderer/components/Grids/composables/gridHooks'

const sanitizeOption: SanitizeOption = {
  allowedTags: [],
  allowedAttributes: {},
}

export default (props: { tab: Tab }, context: SetupContext) => {
  const wrapper = ref<HTMLDivElement>()
  const settings = computed((): HandsOnTable.GridSettings => ({
    data: props.tab.table.options.hasHeader ? props.tab.file.data.slice(1) : props.tab.file.data,
    autoColumnSize: { syncLimit: 10 },
    autoRowSize: false,
    colHeaders: props.tab.table.options.hasHeader
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
    minSpareCols: Number(!props.tab.table.options.printMode),
    minSpareRows: Number(!props.tab.table.options.printMode),
    outsideClickDeselects: false,
    renderAllRows: props.tab.table.options.printMode,
    rowHeaders: true,
    rowHeaderWidth: Math.max(50, (props.tab.file.data.length.toString().length * 16)),
    search: true,
    viewportColumnRenderingOffset: props.tab.table.options.printMode ? props.tab.file.data.length : 'auto',
    viewportRowRenderingOffset: props.tab.table.options.printMode ? props.tab.file.data.length : 'auto',
    ...gridHooks(props, context),
  }))

  watch(() => settings.value, settings => {
    if (props.tab.table.instance && !props.tab.table.instance.isDestroyed) props.tab.table.instance.updateSettings(settings, false)
  })

  watch(() => props.tab.file.path, () => {
    props.tab.table.instance!.loadData(props.tab.file.data)
  })

  onMounted(() => {
    if (wrapper.value) {
      const handsOnTable = new HandsOnTable(wrapper.value, settings.value) as TableInstance
      props.tab.table.instance = handsOnTable
      props.tab.table.search = Search(handsOnTable, props.tab)
      props.tab.table.borders = handsOnTable.getPlugin('customBorders')
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
