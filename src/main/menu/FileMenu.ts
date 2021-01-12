import { BrowserWindow, dialog } from 'electron'
import CSVFile from '@/main/model/CSVFile'

export default class FileMenu {
  /**
   * [ファイル] > [開く]
   *
   * @todo 複数ファイルを開けるようにしたい
   */
  public async open () {
    const file = await dialog.showOpenDialog({ properties: ['openFile'] })
    if (file.canceled || !file.filePaths.length) return

    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    file.filePaths.forEach((path: string) => CSVFile.open(path))
  }
}
