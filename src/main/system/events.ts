import * as fs from 'fs'
import * as path from 'path'
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  WebContents,
} from 'electron'
import * as channels from '@/common/channels'
import FileMenuController from '@/main/menu/controllers/FileMenuController'
import CSVFile from '@/main/model/CSVFile'
import { FileMeta } from '@/common/types'

const csvLoader = new CSVFile()

const getWindow = (contents: WebContents): BrowserWindow => {
  const window = BrowserWindow.fromWebContents(contents)
  if (!window) throw Error('BrowserWindow not found')
  return window
}

ipcMain.on(channels.FILE_OPEN, (e: IpcMainEvent) => {
  FileMenuController.open(getWindow(e.sender))
})

ipcMain.on(channels.FILE_DROPPED, (e: IpcMainEvent, paths: Array<string>) => {
  const window = getWindow(e.sender)
  paths.forEach(async path => {
    const csv = await csvLoader.initialize().setWindow(window).open(path)
    window.webContents.send(channels.FILE_LOADED, csv)
  })
})

ipcMain.on(channels.FILE_RELOAD, (e: IpcMainEvent, path: string, meta: string) => {
  try {
    if (!fs.statSync(path).isFile()) return

    const BUTTON_RELOAD = 1

    const window = getWindow(e.sender)
    const fileMeta: FileMeta = JSON.parse(meta)
    const selected = dialog.showMessageBoxSync(window, {
      title: process.env.npm_package_name,
      message: '設定した文字コードでファイルを再読込しますか？',
      buttons: [
        '閉じる',
        '再読込',
      ],
    })

    if (selected === BUTTON_RELOAD) {
      csvLoader.setWindow(window).setMeta(fileMeta).open(path)
    }
  } catch (e) {}
})

ipcMain.on(channels.FILE_SAVE, (e: IpcMainEvent, file: channels.FILE_SAVE) => {
  FileMenuController.executeSave(channels.FILE_SAVE, file, getWindow(e.sender))
})

ipcMain.on(channels.FILE_SAVE_AS, (e: IpcMainEvent, file: channels.FILE_SAVE_AS) => {
  FileMenuController.executeSave(channels.FILE_SAVE_AS, file, getWindow(e.sender))
})

/**
 * 変更されたファイルを閉じようとした場合、
 * 保存を促すダイアログを表示する
 *
 * @return boolean
 */
ipcMain.handle(channels.FILE_DESTROY_CONFIRM, (e: IpcMainInvokeEvent, file: channels.FILE_DESTROY_CONFIRM): boolean => {
  const BUTTON_NO_SAVE = 0
  const BUTTON_CANCEL = 1
  const BUTTON_SAVE = 2

  const window = getWindow(e.sender)
  const selected = dialog.showMessageBoxSync(window, {
    title: process.env.npm_package_name,
    message: `${file.name} の変更を保存しますか？`,
    detail: '保存しない場合、変更は失われます。',
    buttons: [
      '保存しない',
      'キャンセル',
      '保存',
    ],
    cancelId: BUTTON_CANCEL,
  })

  // 保存するの場合 - 保存処理を行って true を返す
  if (selected === BUTTON_SAVE) return FileMenuController.executeSave(channels.FILE_SAVE, file, getWindow(e.sender))
  // 保存しないの場合 - 保存処理を行わず true を返す
  // キャンセルの場合 - false を返す
  return selected === BUTTON_NO_SAVE
})

ipcMain.on(channels.TABS_SAVE, (e: IpcMainEvent, paths: channels.TABS_SAVE) => {
  fs.writeFileSync(path.join(app.getPath('userData'), 'tab_history.json'), paths)
})

ipcMain.on(channels.APP_CLOSE, () => app.exit())
