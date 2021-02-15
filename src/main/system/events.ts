import { ipcMain, IpcMainEvent } from 'electron'
import * as channels from '@/common/channels'
import FileMenu from '@/main/menu/FileMenu'
// import EditMenu from '@/main/menu/EditMenu'
import CSVFile from '@/main/model/CSVFile'

ipcMain.on(channels.FILE_OPEN, (e: IpcMainEvent) => {
  FileMenu.open(e.sender)
})

ipcMain.on(channels.FILE_DROPPED, (e: IpcMainEvent, paths: Array<string>) => {
  paths.forEach(path => CSVFile.open(path, e.sender))
})

ipcMain.on(channels.FILE_SAVE, (e: IpcMainEvent, file: channels.FILE_SAVE) => {
  FileMenu.executeSave(channels.FILE_SAVE, file, e.sender)
})

ipcMain.on(channels.FILE_SAVE_AS, (e: IpcMainEvent, file: channels.FILE_SAVE) => {
  FileMenu.executeSave(channels.FILE_SAVE_AS, file, e.sender)
})
