import { ipcRenderer, IpcRendererEvent } from 'electron'
import { computed, nextTick } from 'vue'
import csvStringify from 'csv-stringify/lib/sync'
import HandsOnTable from 'handsontable'
import * as channels from '@/common/channels'
import { FileData } from '@/renderer/types'
import { Tabs } from './types'

export default (tabs: Tabs) => {
  const activeFile = computed({
    get: () => tabs.state.files.find((file: FileData) => file.path === tabs.state.active),
    set: (file: FileData) => {
      const index = tabs.state.files.findIndex((file: FileData) => file.path === tabs.state.active)
      tabs.state.files[index] = file
    },
  })

  // 末尾の空要素を削除する
  const _trimEmptyCells = (data: HandsOnTable.CellValue[][]|HandsOnTable.RowObject[]): HandsOnTable.CellValue[][]|HandsOnTable.RowObject[] => {
    if (!activeFile.value || !activeFile.value.table) return data

    const rows = data.slice()

    const emptyRows = activeFile.value.table.countEmptyRows(true)
    rows.splice(data.length - emptyRows, emptyRows)

    if (!rows.length) return []
    const emptyCols = activeFile.value.table.countEmptyCols(true)
    return rows.map(row => row.slice(0, row.length - emptyCols))
  }

  // ファイルを開く
  const open = () => ipcRenderer.send(channels.FILE_OPEN)
  ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
    // データ未操作の場合、初期表示のタブは削除
    if (tabs.state.files.length === 1 && activeFile.value?.path === 'newTab0' && !activeFile.value.dirty) tabs.closeTab(activeFile.value)

    const exists = tabs.state.files.find((fileData: FileData) => fileData.path === file.path)
    if (exists) {
      tabs.state.active = exists.path
    } else {
      tabs.addTab(file)
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

    if (!activeFile.value) return

    const file: channels.FILE_SAVE = {
      path: activeFile.value.path,
      data: csvStringify(_trimEmptyCells(activeFile.value.data)),
    }
    ipcRenderer.send(channelName, file)
  }
  ipcRenderer.on(channels.FILE_SAVE, () => save(channels.FILE_SAVE))
  ipcRenderer.on(channels.FILE_SAVE_AS, () => save(channels.FILE_SAVE_AS))
  ipcRenderer.on(channels.FILE_SAVE_COMPLETE, async (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
    if (!activeFile.value) return

    // 既に同じファイルを開いていた場合は閉じる
    if (path !== tabs.state.active) {
      const sameFileIndex = tabs.state.files.findIndex((file: FileData) => file.path === path)
      sameFileIndex === -1 || tabs.state.files.splice(sameFileIndex, 1)
      await nextTick()
    }

    activeFile.value.dirty = false
    activeFile.value.label = path.split('/').pop() || ''
    activeFile.value.path = path
    tabs.state.active = path
  })

  return {
    activeFile,
    open,
    save,
  }
}
