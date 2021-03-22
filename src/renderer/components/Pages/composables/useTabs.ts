import { ipcRenderer } from 'electron'
import { computed, reactive, ref } from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import * as channels from '@/common/channels'
import { vueI18n } from '@/common/plugins/i18n'
import { FileData, Tab, Options, FileMeta } from '@/renderer/types'
import { useTab } from './types'

const defaultOptions = (): Options => ({
  hasHeader: false,
  search: false,
  printMode: false,
})

const defaultMeta = (): FileMeta => ({
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
  encoding: 'UTF-8',
})

export default (): useTab => {
  const { t } = vueI18n

  const count = ref(0)
  const state = reactive({
    count,
    active: '',
    tabs: [] as Tab[],
  })

  const options = computed<Options>({
    get: () => {
      const tab = state.tabs.find(tab => tab.file.path === state.active)
      return tab ? tab.options : defaultOptions()
    },
    set: options => {
      const index = state.tabs.findIndex((tab: Tab) => tab.file.path === state.active)
      if (index !== -1) state.tabs[index].options = options
    },
  })

  const onEdit = () => {
    const fileData = state.tabs.find(tab => tab.file.path === state.active)
    if (fileData) fileData.dirty = true
  }

  const addTab = (file?: FileData) => {
    file = file || {
      label: t('tabs.new_tab'),
      path: `newTab${count.value}`,
      data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
      meta: defaultMeta(),
    }

    if (!file.data.length) file.data = HandsOnTable.helper.createEmptySpreadsheetData(100, 26)

    const tab: Tab = {
      id: count.value++,
      table: null,
      dirty: false,
      options: defaultOptions(),
      file,
    }

    state.tabs.push(tab)
    state.active = file.path
  }

  const closeTab = async (tab: Tab) => {
    // ファイルが未保存の場合は確認ダイアログを表示
    if (tab.dirty) {
      const item = {
        name: tab.file.label,
        path: tab.file.path,
        data: csvStringify(tab.file.data),
      }
      if (!await ipcRenderer.invoke(channels.FILE_DESTROY_CONFIRM, item)) return
    }

    const index = state.tabs.findIndex(st => st === tab)
    state.tabs.splice(index, 1)

    if (!state.tabs.length) return
    if (!state.tabs.find(st => st.file.path === state.active)) {
      state.active = state.tabs[index]?.file.path || state.tabs[0].file.path
    }
  }

  // 新しいタブを1件作成しておく
  addTab()

  return {
    state,
    options,
    onEdit,
    addTab,
    closeTab,
  }
}
