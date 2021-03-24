import { ipcRenderer, IpcRendererEvent } from 'electron'
import { computed, nextTick } from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import * as channels from '@/common/channels'
import { FileData, Tab } from '@/common/types'
import { useTab } from './types'

export default ({ state, addTab, closeTab }: useTab) => {
  const activeTab = computed({
    get: () => state.tabs.find((tab: Tab) => tab.file.path === state.active),
    set: tab => {
      const index = state.tabs.findIndex((file: FileData) => file.path === state.active)
      state.tabs[index] = tab
    },
  })

  // 末尾の空要素を削除する
  const _trimEmptyCells = (data: HandsOnTable.CellValue[][]|HandsOnTable.RowObject[]): HandsOnTable.CellValue[][]|HandsOnTable.RowObject[] => {
    if (!activeTab.value || !activeTab.value.table) return data

    const rows = data.slice()

    const emptyRows = activeTab.value.table.countEmptyRows(true)
    rows.splice(data.length - emptyRows, emptyRows)

    if (!rows.length) return []
    const emptyCols = activeTab.value.table.countEmptyCols(true)
    return rows.map(row => row.slice(0, row.length - emptyCols))
  }

  // ファイルを開く
  const open = () => ipcRenderer.send(channels.FILE_OPEN)
  ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
    // データ未操作の場合、初期表示のタブは削除
    if (state.tabs.length === 1 && activeTab.value?.file.path === 'newTab0' && !activeTab.value.dirty) closeTab(activeTab.value)

    const exists = state.tabs.find((tab: Tab) => tab.file.path === file.path)
    if (exists) {
      state.active = exists.path
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
    ipcRenderer.send(channels.FILE_DROPPED, paths)
  })

  // ファイルを保存
  const save = (channelName?: string) => {
    if (!channelName) channelName = channels.FILE_SAVE

    if (!activeTab.value) return

    const file: channels.FILE_SAVE = {
      path: activeTab.value.file.path,
      data: csvStringify(_trimEmptyCells(activeTab.value.file.data)),
    }
    ipcRenderer.send(channelName, file)
  }
  ipcRenderer.on(channels.FILE_SAVE, () => save(channels.FILE_SAVE))
  ipcRenderer.on(channels.FILE_SAVE_AS, () => save(channels.FILE_SAVE_AS))
  ipcRenderer.on(channels.FILE_SAVE_COMPLETE, async (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
    if (!activeTab.value) return

    // 既に同じファイルを開いていた場合は閉じる
    if (path !== state.active) {
      const sameFileIndex = state.tabs.findIndex((file: FileData) => file.path === path)
      sameFileIndex === -1 || state.tabs.splice(sameFileIndex, 1)
      await nextTick()
    }

    activeTab.value.dirty = false
    activeTab.value.file.label = path.split('/').pop() || ''
    activeTab.value.file.path = path
    state.active = path
  })

  return {
    activeTab,
    open,
    save,
  }
}
