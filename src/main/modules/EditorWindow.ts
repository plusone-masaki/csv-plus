import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
} from 'electron'
import { FileData } from '@/@types/types'
import * as channels from '@/assets/constants/channels'
import { csvFile } from '@/main/modules/CSVFile'
import FileMenuController from '@/main/menu/controllers/FileMenuController'

export default class EditorWindow extends BrowserWindow {
  public constructor (options: BrowserWindowConstructorOptions) {
    super(options)

    csvFile.on('FAILED_LOAD', (filepath: string, reason: string) => {
      dialog.showErrorBox('ファイルを開けませんでした', `${reason}\n${filepath}`)
    })
    csvFile.on('AFTER_LOAD', (payload: FileData) => {
      this.webContents.send(channels.FILE_LOADED, payload)
      FileMenuController.addRecentDocument(payload.path)
    })
  }

  public static make (options: BrowserWindowConstructorOptions) {
    return new EditorWindow(options)
  }
}
