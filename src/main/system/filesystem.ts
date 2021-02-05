import { app, BrowserWindow } from 'electron'
import CSVFile from '@/main/model/CSVFile'

export default (window: BrowserWindow) => {
  const argv = process.argv
  if (argv.length >= 2) {
    const path = argv[1]
    if (path) CSVFile.open(path, window)
  }

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
