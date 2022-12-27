import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
} from 'electron'
import { FileData } from '@/@types/types'
import * as channels from '@/assets/constants/channels'
import FileMenu from '@/main/menu/FileMenu'
import { getModule } from '@/main/modules'

const fileMenu = new FileMenu()
const csvFile = getModule('csvFile')

export default class EditorWindow extends BrowserWindow {
  public constructor (options: BrowserWindowConstructorOptions) {
    super(options)

    csvFile.on('FAILED_LOAD', (filepath: string, reason: string) => {
      dialog.showErrorBox('ファイルを開けませんでした', `${reason}\n${filepath}`)
    })
    csvFile.on('AFTER_LOAD', (payload: FileData) => {
      this.webContents.send(channels.FILE_LOADED, payload)
      fileMenu.addRecentDocument(payload.path)
    })
  }

  public static make (options: BrowserWindowConstructorOptions) {
    return new EditorWindow(options)
  }
}
