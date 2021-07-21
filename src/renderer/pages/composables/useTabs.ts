import { ipcRenderer } from 'electron'
import {
  computed,
  reactive,
  ref,
  Ref,
  watch,
  WritableComputedRef,
} from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import { FileData, Tab, Options, FileMeta, Calculation } from '@/@types/types'
import * as channels from '@/common/channels'
import { useI18n } from 'vue-i18n'
import { defaultLinefeed } from '@/common/plugins/helpers'
import { persistentTabs } from '@/renderer/helpers/persistentStates'

export interface State {
  count: number
  activeId: number
  tabs: Tab[]
}

export type UseTab = {
  state: State

  options: Ref<Options>
  activeTab: WritableComputedRef<Tab|undefined>

  onEdit: () => void
  addTab: (fileData?: FileData) => void
  closeTab: (tab: Tab) => void
}

const defaultOptions = (): Options => ({
  hasHeader: false,
  search: {
    enable: false,
    enableReplace: false,
    matchCase: false,
    regexp: false,
    keyword: '',
    replace: '',
    results: undefined,
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

export default (): UseTab => {
  const { t } = useI18n()

  const count = ref(0)
  const state = reactive({
    count,
    activeId: -1,
    tabs: [] as Tab[],
  })

  // computed
  const activeTab = computed<Tab|undefined>({
    get: () => state.tabs.find((tab: Tab) => tab.id === state.activeId),
    set: tabData => {
      if (!tabData) return delete window.onresize
      const index = state.tabs.findIndex(tab => tab.id === state.activeId)
      state.tabs[index] = tabData
    },
  })

  const options = computed<Options>({
    get: () => {
      return activeTab.value?.table.options || defaultOptions()
    },
    set: options => {
      if (activeTab.value) activeTab.value.table.options = options
    },
  })

  // watch
  watch(() => state.tabs, () => persistentTabs(state.tabs))

  // methods
  const onEdit = () => {
    if (activeTab.value) activeTab.value.dirty = true
  }

  /**
   * タブを追加
   *
   * @param {FileData|undefined} fileData
   */
  const addTab = (fileData?: FileData) => {
    const file = fileData || {
      label: t('tabs.new_tab'),
      path: `newTab${count.value}`,
      data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
      meta: defaultMeta(),
    }

    if (!file.data.length) file.data = HandsOnTable.helper.createEmptySpreadsheetData(100, 26)

    const tab: Tab = {
      id: count.value++,
      table: {
        search: () => { /* empty */ },
        options: defaultOptions(),
      },
      file,
      dirty: false,
      calculation: defaultCalculation(),
    }

    state.tabs.push(tab)
    state.activeId = tab.id
    if (fileData) persistentTabs(state.tabs)
  }
  ipcRenderer.on(channels.FILE_NEW, () => addTab())

  /**
   * タブを閉じる
   *
   * @param {Tab} tab
   */
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

    const index = state.tabs.findIndex(tb => tb.id === tab.id)
    state.tabs.splice(index, 1)

    if (state.tabs.length && state.tabs.every(tab => tab.id !== activeTab.value?.id)) {
      state.activeId = state.tabs[index]?.id || state.tabs[index - 1]?.id || state.tabs[0].id
    } else if (!state.tabs.length) {
      state.activeId = -1
    }

    persistentTabs(state.tabs)
  }

  // アプリ起動時、全てのタブが開き終わったら並び順まで復元
  ipcRenderer.on(channels.TABS_LOADED, (_, paths: channels.TABS_LOADED, filepath?: string) => {
    state.tabs = paths
      .map(path => state.tabs.find((tab: Tab) => tab.file.path === path))
      .filter((tab?: Tab) => !!tab)
      .concat(state.tabs.filter(tab => paths.indexOf(tab.file.path) === -1)) as Tab[]

    if (filepath) {
      const tab = state.tabs.find(tab => tab.file.path === filepath)
      if (tab) state.activeId = tab.id
    }
  })

  /**
   * アプリ終了前処理
   */
  ipcRenderer.on(channels.APP_WILL_CLOSE, async () => {
    // ファイルが未保存の場合は確認ダイアログを表示
    const allConfirmed: Promise<boolean>[] = []

    state.tabs.forEach(tab => {
      allConfirmed.push(new Promise(resolve => {
        if (tab.dirty) {
          const item = {
            name: tab.file.label,
            path: tab.file.path,
            meta: JSON.stringify(tab.file.meta),
            data: csvStringify(tab.file.data),
          }
          ipcRenderer.invoke(channels.FILE_DESTROY_CONFIRM, item)
            .then(res => resolve(res))
            .catch(() => resolve(true))
        } else {
          resolve(true)
        }
      }))
    })

    const confirmed = await Promise.all(allConfirmed)
    if (confirmed.every(c => c)) ipcRenderer.send(channels.APP_CLOSE)
  })

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
