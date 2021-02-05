import { app, BrowserWindow } from 'electron'
import CSVFile from '@/main/model/CSVFile'

export default (window: BrowserWindow) => {
  window.webContents.on('did-finish-load', () => {
    const argv = process.argv
    if (argv.length >= 2 && argv[1]) {
      const path = argv[1]
      CSVFile.open(path, window)
    }
  })

  /**
   * MacOSやフロントから取得したファイル情報を処理する
   *
   * @param {Event} e
   * @param {string} path
   */
  app.on('open-file', (e, path) => {
    e.preventDefault()
    CSVFile.open(path, window)
  })
}
