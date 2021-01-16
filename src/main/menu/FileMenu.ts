import { BrowserWindow, dialog, MenuItem } from 'electron'
import CSVFile from '@/main/model/CSVFile'

export default class FileMenu {
  /**
   * [ファイルを開く]
   */
  public async open (menu: MenuItem, win: BrowserWindow) {
    const file = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    if (file.canceled || !file.filePaths.length) return

    file.filePaths.forEach((path: string) => CSVFile.open(path, win))
  }

  /**
   * [ファイルの保存]
   */
  public async save (path: string, data: string) {
    CSVFile.save(path, data)
  }
}
