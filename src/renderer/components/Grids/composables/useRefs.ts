import {
  computed,
  onMounted,
  ref,
  SetupContext,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Props } from './types'
import 'handsontable/languages/ja-JP'

export default (props: Props, context: SetupContext) => {
  const wrapper = ref<HTMLDivElement>()
  const search = ref<HandsOnTable.plugins.Search|null>(null)
  const filter = ref<HandsOnTable.plugins.Filters|null>(null)
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
      if (!['loadData'].includes(src)) context.emit('edit')
    },
  }))

  onMounted(() => {
    if (wrapper.value) {
      const handsOnTable = new HandsOnTable(wrapper.value, settings.value)
      search.value = handsOnTable.getPlugin('search')
      filter.value = handsOnTable.getPlugin('filters')
      context.emit('load', handsOnTable)
    }
  })

  return {
    wrapper,
    search,
    filter,
    settings,
  }
}
