import { app, BrowserWindow } from 'electron'
import * as channels from '@/common/channels'

export default (window: BrowserWindow) => {
  const argv = process.argv
  if (argv.length) {
    const path = argv[argv.length - 1]
    if (path) window.webContents.send(channels.FILE_OPEN, path)
  }

  /**
   * MacOSやフロントから取得したファイル情報を処理する
   *
   * @param {Event} e
   * @param {string} path
   */
  app.on('open-file', (e, path) => {
    e.preventDefault()
    window.webContents.send(channels.FILE_OPEN, path)
  })
}
