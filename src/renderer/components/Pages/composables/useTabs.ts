import { ipcRenderer } from 'electron'
import { computed, reactive, ref } from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import { FileData, Tab, Options, FileMeta, Calculation } from '@/common/types'
import * as channels from '@/common/channels'
import { vueI18n } from '@/common/plugins/i18n'
import { defaultLinefeed } from '@/common/plugins/helpers'
import { useTab } from './types'

const defaultOptions = (): Options => ({
  hasHeader: false,
  search: {
    enable: false,
    matchCase: false,
    regexp: false,
    keyword: '',
  },
  printMode: false,
})

const defaultMeta = (): FileMeta => ({
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
  linefeed: defaultLinefeed(),
  encoding: 'UTF-8',
  bom: false,
})

const defaultCalculation = (): Calculation => ({
  selected: {
    rowLength: 0,
    colLength: 0,
    summary: NaN,
  },
})

export default (): useTab => {
  const { t } = vueI18n

  const count = ref(0)
  const state = reactive({
    count,
    activeId: -1,
    tabs: [] as Tab[],
  })

  const activeTab = computed<Tab|undefined>({
    get: () => state.tabs.find((tab: Tab) => tab.id === state.activeId),
    set: tabData => {
      const index = state.tabs.findIndex(tab => tab.id === state.activeId)
      if (index !== -1) state.tabs[index] = tabData as Tab
    },
  })

  const options = computed<Options>({
    get: () => {
      return activeTab.value?.options || defaultOptions()
    },
    set: options => {
      if (activeTab.value) activeTab.value.options = options
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
      file,
      dirty: false,
      options: defaultOptions(),
      calculation: defaultCalculation(),
    }

    state.tabs.push(tab)
    state.activeId = tab.id
  }
  ipcRenderer.on(channels.FILE_NEW, () => addTab())

  const closeTab = async (tab: Tab) => {
    // ファイルが未保存の場合は確認ダイアログを表示
    if (tab.dirty) {
      const item = {
        name: tab.file.label,
        path: tab.file.path,
        meta: JSON.stringify(tab.file.meta),
        data: csvStringify(tab.file.data),
      }
      if (!await ipcRenderer.invoke(channels.FILE_DESTROY_CONFIRM, item)) return
    }

    const index = state.tabs.findIndex(t => t.id === tab.id)
    state.tabs.splice(index, 1)

    if (state.tabs.length && state.tabs.every(tab => tab.id !== activeTab.value?.id)) {
      state.activeId = state.tabs[index]?.id || state.tabs[index - 1]?.id || state.tabs[0].id
    } else if (!state.tabs.length) {
      state.activeId = -1
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
