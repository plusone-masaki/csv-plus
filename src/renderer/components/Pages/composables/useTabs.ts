import { ipcRenderer } from 'electron'
import { computed, reactive, ref } from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import { FileData, Tab, Options, FileMeta } from '@/common/types'
import * as channels from '@/common/channels'
import { vueI18n } from '@/common/plugins/i18n'
import { defaultLinefeed } from '@/common/plugins/helpers'
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
  linefeed: defaultLinefeed(),
})

const emptyTab = (): Tab => ({
  id: -1,
  table: null,
  dirty: false,
  file: {
    label: '',
    path: '',
    data: [],
    meta: defaultMeta(),
  },
  options: defaultOptions(),
})

export default (): useTab => {
  const { t } = vueI18n

  const count = ref(0)
  const state = reactive({
    count,
    active: -1,
    tabs: [] as Tab[],
  })

  const activeTab = computed({
    get: () => state.tabs.find((tab: Tab) => tab.id === state.active) || emptyTab(),
    set: tabData => {
      const index = state.tabs.findIndex(tab => tab.id === state.active)
      if (index !== -1) state.tabs[index] = tabData
    },
  })

  const options = computed<Options>({
    get: () => {
      return activeTab.value.options
    },
    set: options => {
      activeTab.value.options = options
    },
  })

  const onEdit = () => {
    if (activeTab.value) activeTab.value.dirty = true
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
    state.active = tab.id
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

    const index = state.tabs.findIndex(t => t.id === tab.id)
    state.tabs.splice(index, 1)

    // if (!state.tabs.length) addTab()
    if (!activeTab.value) {
      state.active = state.tabs[index]?.id || state.tabs[0].id
    }
  }

  // 新しいタブを1件作成しておく
  addTab()

  return {
    state,
    options,
    activeTab,
    onEdit,
    addTab,
    closeTab,
  }
}
