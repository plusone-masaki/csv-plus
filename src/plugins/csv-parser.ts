import { ipcRenderer, IpcRendererEvent } from 'electron'
import * as channels from '@/common/channels.ts'
import CSVFile from '@/renderer/model/CSVFile'

/**
 * ファイルを開く
 */
ipcRenderer.on(channels.FILE_OPEN, async (e: IpcRendererEvent, path: string) => {
  CSVFile.open(path)
})
