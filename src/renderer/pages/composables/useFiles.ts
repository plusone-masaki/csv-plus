import { IpcRendererEvent } from 'electron'
import { nextTick } from 'vue'
import * as channels from '@/common/channels'
import { Tab } from '@/@types/types'
import { UseTab } from './useTabs'
import { persistentTabs } from '@/renderer/helpers/persistentStates'

export default ({ state, activeTab, addTab, closeTab }: UseTab) => {
  // 末尾の空要素を削除する
  const _trimEmptyCells = (data: string[][]): string[][] => {
    if (!activeTab.value?.table) return data

    const rows = data.slice()
    const emptyRows = activeTab.value.table.instance!.countEmptyRows(true)
    rows.splice(data.length - emptyRows, emptyRows)

    if (!rows.length) return []
    const emptyCols = activeTab.value.table.instance!.countEmptyCols(true)
    return rows.map(row => row.slice(0, row.length - emptyCols))
  }

  // ファイルを開く
  const open = () => window.api[channels.FILE_OPEN]()
  window.api.on(channels.FILE_LOADED, async (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
    if (!file) return

    // データ未操作の場合、初期表示のタブは削除
    if (
      state.tabs.length === 1 &&
      activeTab.value?.id === 0 &&
      !activeTab.value?.dirty
    ) {
      await closeTab(activeTab.value)
    }

    const exists = state.tabs.find((tab: Tab) => tab.file.path === file.path)
    if (exists) {
      state.activeId = exists.id
      exists.file = file
    } else {
      addTab(file)
    }
  })

  // ファイルをドロップ
  document.addEventListener('dragover', e => e.preventDefault()) // drop イベントを発生させるために必要
  document.addEventListener('drop', e => {
    e.preventDefault()
    if (!(e.dataTransfer && e.dataTransfer.files)) return
    const files = Array.from(e.dataTransfer.files)
    const paths = files.map(file => file.path)
    window.api[channels.FILE_DROPPED](paths)
  })

  // ファイルを保存
  const save = async (channelName?: 'FILE_SAVE'|'FILE_SAVE_AS') => {
    if (!channelName) channelName = channels.FILE_SAVE
    if (!activeTab.value) return

    const fileData = activeTab.value.file
    const meta = JSON.stringify(fileData.meta)
    const file: channels.FILE_SAVE = {
      path: fileData.path,
      meta: JSON.stringify(fileData.meta),
      data: await window.api[channels.CSV_STRINGIFY](JSON.stringify(_trimEmptyCells(fileData.data)), meta),
    }
    window.api[channelName](file)
  }
  window.api.on(channels.FILE_SAVE, () => save(channels.FILE_SAVE))
  window.api.on(channels.FILE_SAVE_AS, () => save(channels.FILE_SAVE_AS))
  window.api.on(channels.FILE_SAVE_COMPLETE, async (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
    if (!activeTab.value) return

    // 既に同じファイルを開いていた場合は閉じる
    if (path !== activeTab.value.file.path) {
      const sameFileIndex = state.tabs.findIndex(({ file }: Tab) => file.path === path)
      if (sameFileIndex !== -1) state.tabs.splice(sameFileIndex, 1)
      await nextTick()
    }

    activeTab.value.dirty = false
    activeTab.value.file.label = path.split(window.const.sep).pop() || ''
    activeTab.value.file.path = path

    persistentTabs(state.tabs)
  })

  // 印刷
  const print = () => {
    if (activeTab.value?.table?.instance) {
      activeTab.value.table.instance.addHookOnce('afterRender', () => window.print())
      activeTab.value.table.options.printMode = true
    }
  }
  window.api.on(channels.MENU_PRINT, print)

  return {
    activeTab,
    open,
    save,
    print,
  }
}
