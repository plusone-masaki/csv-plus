import * as pathModule from 'path'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import * as channels from '@/assets/constants/channels'
import { FileMeta } from '@/@types/types'

const parseMeta = (meta: string): FileMeta => JSON.parse(meta)

contextBridge.exposeInMainWorld('const', {
  sep: pathModule.sep,
})

contextBridge.exposeInMainWorld('platform', process.platform)

contextBridge.exposeInMainWorld('api', {
  on: (channel: string, cb: (e: IpcRendererEvent, ...argv: any) => void) =>
    ipcRenderer.on(channel, (e, ...argv) => cb(e, ...argv)),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
  [channels.APP_CLOSE]: () => ipcRenderer.send(channels.APP_CLOSE),
  [channels.CSV_PARSE]: (data: string, meta: string) => ipcRenderer.invoke(channels.CSV_PARSE, { data, meta: parseMeta(meta) }),
  [channels.CSV_STRINGIFY]: (data: string[][], meta: string) => ipcRenderer.invoke(channels.CSV_STRINGIFY, { data, meta: parseMeta(meta) }),
  [channels.FILE_RELOAD]: (path: string, meta: string) => ipcRenderer.send(channels.FILE_RELOAD, path, parseMeta(meta)),
  [channels.FILE_OPEN]: () => ipcRenderer.send(channels.FILE_OPEN),
  [channels.FILE_DROPPED]: (paths: string[]) => ipcRenderer.send(channels.FILE_DROPPED, paths),
  [channels.FILE_SAVE]: (file: channels.FILE_SAVE) => ipcRenderer.send(channels.FILE_SAVE, file),
  [channels.FILE_SAVE_AS]: (file: channels.FILE_SAVE) => ipcRenderer.send(channels.FILE_SAVE_AS, file),
  [channels.FILE_DESTROY_CONFIRM]: (item: channels.FILE_DESTROY_CONFIRM) => ipcRenderer.invoke(channels.FILE_DESTROY_CONFIRM, item),
  [channels.DATA_HASH]: (data: channels.DATA_HASH) => ipcRenderer.invoke(channels.DATA_HASH, data),
  [channels.TABS_SAVE]: (data: channels.TABS_SAVE) => ipcRenderer.send(channels.TABS_SAVE, data),
  [channels.TABS_CHANGED]: (label: channels.TABS_CHANGED) => ipcRenderer.send(channels.TABS_CHANGED, label),
  [channels.MENU_SELECT_ALL]: (data: string) => ipcRenderer.send(channels.TABS_SAVE, data),
})
