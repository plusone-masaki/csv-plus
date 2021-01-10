import { app, BrowserWindow, ipcRenderer } from 'electron'
import CSVFile from '@/main/model/CSVFile'

export default (window: BrowserWindow) => {
  const csvLoaded = (data: any[]) => {
    console.log(data)
    window.webContents.send('csv-loaded', data)
  }

  const argv = process.argv
  if (argv.length) {
    const path = argv[argv.length - 1]
    if (path)
    CSVFile.open(path, csvLoaded)
  }

  /**
   * MacOSやフロントから取得したファイル情報を処理する
   *
   * @param {Event} e
   * @param {string} path
   */
  app.on('open-file', (e, path) => {
    e.preventDefault()
    CSVFile.open(path, csvLoaded)
  })
}
