import {
  BrowserWindow,
  MenuItem,
  dialog,
} from 'electron'
import * as fs from 'fs'
import * as channels from '@/common/channels'
import CSVFile from '@/main/model/CSVFile'

export default class FileMenu {
  public static open (window: BrowserWindow): void
  public static open (menu: MenuItem, window: BrowserWindow): void

  /**
   * [ファイルを開く]
   *
   * @param {MenuItem|BrowserWindow} menu
   * @param {BrowserWindow|undefined} window
   */
  public static open (menu: MenuItem|BrowserWindow, window?: BrowserWindow) {
    window = window || menu as BrowserWindow
    const files = dialog.showOpenDialogSync(window, { properties: ['openFile', 'multiSelections'] })
    if (!files) return

    files.forEach((path: string) => CSVFile.open(path, window as BrowserWindow))
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
   * @param {BrowserWindow} window
   */
  public static executeSave (channelName: string, file: channels.FILE_SAVE, window: BrowserWindow): boolean {
    switch (channelName) {
      case channels.FILE_SAVE:
        if (!FileMenu._fileExists(file.path)) file.path = FileMenu._selectPath(window)
        break
      case channels.FILE_SAVE_AS:
        file.path = FileMenu._selectPath(window, FileMenu._fileExists(file.path) ? file.path : undefined)
        break
    }

    if (!file.path) return false

    try {
      CSVFile.save(file.path, file.data)
      window.webContents.send(channels.FILE_SAVE_COMPLETE, file.path)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * 保存する場所を選択
   *
   * @private
   * @param {BrowserWindow} window
   * @param {string|undefined} path
   * @return {string}
   */
  private static _selectPath (window: BrowserWindow, path?: string): string {
    return dialog.showSaveDialogSync(window, {
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
  private static _fileExists (path: string): boolean {
    try {
      return fs.statSync(path).isFile()
    } catch (e) {
      return false
    }
  }
}
