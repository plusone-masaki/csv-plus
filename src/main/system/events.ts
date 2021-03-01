import { BrowserWindow, dialog, ipcMain, IpcMainEvent, IpcMainInvokeEvent, WebContents } from 'electron'
import * as channels from '@/common/channels'
import FileMenu from '@/main/menu/FileMenu'
// import EditMenu from '@/main/menu/EditMenu'
import CSVLoader from '@/main/model/CSVLoader'

const csvLoader = new CSVLoader()

const getWindow = (contents: WebContents): BrowserWindow => {
  const window = BrowserWindow.fromWebContents(contents)
  if (!window) throw Error('BrowserWindow not found')
  return window
}

ipcMain.on(channels.FILE_OPEN, (e: IpcMainEvent) => {
  FileMenu.open(getWindow(e.sender))
})

ipcMain.on(channels.FILE_DROPPED, (e: IpcMainEvent, paths: Array<string>) => {
  const window = getWindow(e.sender)
  paths.forEach(async path => window.webContents.send(channels.FILE_LOADED, await csvLoader.setWindow(window).open(path)))
})

ipcMain.on(channels.FILE_SAVE, (e: IpcMainEvent, file: channels.FILE_SAVE) => {
  FileMenu.executeSave(channels.FILE_SAVE, file, getWindow(e.sender))
})

ipcMain.on(channels.FILE_SAVE_AS, (e: IpcMainEvent, file: channels.FILE_SAVE_AS) => {
  FileMenu.executeSave(channels.FILE_SAVE_AS, file, getWindow(e.sender))
})

/**
 * 変更されたファイルを閉じようとした場合、
 * 保存を促すダイアログを表示する
 */
ipcMain.handle(channels.FILE_DESTROY_CONFIRM, (e: IpcMainInvokeEvent, file: channels.FILE_DESTROY_CONFIRM): boolean => {
  const BUTTON_NO_SAVE = 0
  const BUTTON_CANCEL = 1
  const BUTTON_SAVE = 2

  const window = getWindow(e.sender)
  const pressed = dialog.showMessageBoxSync(window, {
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

  if (pressed === BUTTON_SAVE) return FileMenu.executeSave(channels.FILE_SAVE, file, getWindow(e.sender))
  return pressed === BUTTON_NO_SAVE
})
