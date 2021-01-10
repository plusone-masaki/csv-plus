import { dialog } from 'electron'
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

    // ファイルを一つだけ開く
    const path = file.filePaths[0]
    CSVFile.open(path)
  }
}
