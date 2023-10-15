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
import UndoRedo from '@/renderer/plugins/UndoRedo'
import gridHooks from '@/renderer/components/Grids/composables/gridHooks'

const sanitizeOption: SanitizeOption = {
  allowedTags: [],
  allowedAttributes: {},
}

export default (props: { tab: Tab }, context: SetupContext) => {
  const wrapper = ref<HTMLDivElement>()
  const headerRow = computed(() => props.tab.file.data[0].map((d: string) => d ? sanitize(d, sanitizeOption) : ''))
  const colHeaders = computed(() => {
    switch (props.tab.table.options.header) {
      case 'ALPHA': return true
      case 'NUMERIC': return (index: number) => (++index)
      case 'ROW': return headerRow.value
    }
  })

  const settings = computed((): HandsOnTable.GridSettings => ({
    data: props.tab.file.data,
    autoColumnSize: { syncLimit: 10 },
    autoRowSize: false,
    autoWrapCol: false,
    autoWrapRow: false,
    colHeaders: colHeaders.value as any, // 型定義が間違っているのでキャスト
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
    undo: false,
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
      props.tab.table.undoRedo = props.tab.table.undoRedo || new UndoRedo(props.tab)
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
