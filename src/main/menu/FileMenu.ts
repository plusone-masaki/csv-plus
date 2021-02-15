import {
  BrowserWindow,
  MenuItem,
  dialog,
  WebContents,
} from 'electron'
import * as fs from 'fs'
import * as channels from '@/common/channels'
import CSVFile from '@/main/model/CSVFile'

export default class FileMenu {
  public static open (content: WebContents): void
  public static open (menu: MenuItem, window: BrowserWindow): void

  /**
   * [ファイルを開く]
   *
   * @param {MenuItem|WebContents} menu
   * @param {BrowserWindow|undefined} window
   */
  public static open (menu: MenuItem|WebContents, window?: BrowserWindow): void {
    const files = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] })
    if (!files) return

    files.forEach((path: string) => CSVFile.open(path, window || menu as WebContents))
  }

  /**
   * [上書き保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static save (menu: MenuItem, window: BrowserWindow) {
    window.webContents.send(channels.FILE_SAVE)
  }

  /**
   * [名前を付けて保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static saveAs (menu: MenuItem, window: BrowserWindow) {
    window.webContents.send(channels.FILE_SAVE_AS)
  }

  /**
   * 保存処理の実行
   *
   * @param {string} channelName
   * @param {{ path: string, data: string }} file
   * @param {WebContents} webContents
   */
  public static executeSave (channelName: string, file: channels.FILE_SAVE, webContents: WebContents) {
    switch (channelName) {
      case channels.FILE_SAVE:
        if (!FileMenu._fileExists(file.path)) file.path = FileMenu._selectPath()
        break
      case channels.FILE_SAVE_AS:
        file.path = FileMenu._selectPath(FileMenu._fileExists(file.path) ? file.path : undefined)
        break
    }

    if (!file.path) return
    CSVFile.save(file.path, file.data)
    webContents.send(channels.FILE_SAVE_COMPLETE, file.path)
  }

  /**
   * 保存する場所を選択
   *
   * @private
   * @param {string|undefined} path
   * @return {string}
   */
  private static _selectPath (path?: string) {
    return dialog.showSaveDialogSync({
      title: '名前を付けて保存',
      defaultPath: path,
      properties: [
        'createDirectory',
        'showOverwriteConfirmation',
      ],
    }) || ''
  }

  /**
   * ファイルの存在確認
   *
   * @private
   * @param {string} path
   * @return {boolean}
   */
  private static _fileExists (path: string) {
    try {
      return fs.statSync(path).isFile()
    } catch (e) {
      return false
    }
  }
}
