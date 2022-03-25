import { IpcRendererEvent } from 'electron'
import {
  computed,
  reactive,
  ref,
  Ref,
  watch,
  WritableComputedRef,
} from 'vue'
import HandsOnTable from 'handsontable'
import { FileData, Tab, Options, FileMeta, Calculation } from '@/@types/types'
import * as channels from '@/assets/constants/channels'
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

const defaultMeta = async (data: string[][]): Promise<FileMeta> => {
  const _genMeta = async (): Promise<FileMeta> => ({
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '"',
    linefeed: defaultLinefeed(),
    encoding: 'UTF-8',
    bom: false,
    hash: await window.api[channels.DATA_HASH](JSON.stringify(data)),
  })

  return {
    ...(await _genMeta()),
    _origin: await _genMeta(),
  }
}

const defaultCalculation = (): Calculation => ({})

export default (): UseTab => {
  const { t } = useI18n()

  const count = ref(0)
  const state: State = reactive({
    count,
    activeId: -1,
    tabs: [],
  })

  // computed
  const activeTab = computed<Tab|undefined>({
    get: () => state.tabs.find((tab: Tab) => tab.id === state.activeId),
    set: tabData => {
      if (!tabData) {
        window.onresize = null
        return
      }
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
  const addTab = async (fileData?: FileData) => {
    const emptyData = HandsOnTable.helper.createEmptySpreadsheetData(100, 26)

    const file = fileData || {
      label: t('tabs.new_tab'),
      path: `newTab${count.value}`,
      data: emptyData,
      meta: await defaultMeta(emptyData),
    }

    if (!file.data.length) file.data = emptyData

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
  window.api.on(channels.FILE_NEW, addTab)

  /**
   * タブを閉じる
   *
   * @param {Tab} tab
   */
  const closeTab = async (tab: Tab) => {
    // ファイルが未保存の場合は確認ダイアログを表示
    if (tab.dirty) {
      const meta = JSON.stringify(tab.file.meta)
      const item = {
        name: tab.file.label,
        path: tab.file.path,
        meta: JSON.stringify(tab.file.meta),
        data: await window.api[channels.CSV_STRINGIFY](JSON.stringify(tab.file.data), meta),
      }
      if (!await window.api[channels.FILE_DESTROY_CONFIRM](item)) return
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
  window.api.on(channels.TABS_LOADED, (e: IpcRendererEvent, paths: channels.TABS_LOADED, filepath?: string) => {
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
  window.api.on(channels.APP_WILL_CLOSE, async () => {
    // ファイルが未保存の場合は確認ダイアログを表示
    const allConfirmed: Promise<boolean>[] = []

    state.tabs.forEach(tab => {
      allConfirmed.push((async () => {
        try {
          if (tab.dirty) {
            const meta = JSON.stringify(tab.file.meta)
            const item = {
              name: tab.file.label,
              path: tab.file.path,
              meta: JSON.stringify(tab.file.meta),
              data: await window.api[channels.CSV_STRINGIFY](JSON.stringify(tab.file.data), meta),
            }
            return window.api[channels.FILE_DESTROY_CONFIRM](item) as Promise<boolean>
          } else {
            return true
          }
        } catch (e) {
          return true
        }
      })())
    })

    const confirmed = await Promise.all(allConfirmed)
    if (confirmed.every(c => c)) window.api[channels.APP_CLOSE]()
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
