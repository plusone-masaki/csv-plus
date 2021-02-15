import {
  BrowserWindow,
  MenuItem,
  dialog,
  WebContents,
} from 'electron'
import * as fs from 'fs'
import CSVFile from '@/main/model/CSVFile'
import * as channels from '@/common/channels'

export default class FileMenu {
  /**
   * [ファイルを開く]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static open (menu: MenuItem, win: BrowserWindow) {
    const files = dialog.showOpenDialogSync(win, { properties: ['openFile', 'multiSelections'] })
    if (!files) return

    files.forEach((path: string) => CSVFile.open(path, win))
  }

  /**
   * [上書き保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static save (menu: MenuItem, win: BrowserWindow) {
    win.webContents.send(channels.FILE_SAVE)
  }

  /**
   * [名前を付けて保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static saveAs (menu: MenuItem, win: BrowserWindow) {
    win.webContents.send(channels.FILE_SAVE_AS)
  }

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
   * @param {string|undefined} path
   * @private
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
   * @param {string} path
   * @private
   */
  private static _fileExists (path: string) {
    try {
      return fs.statSync(path).isFile()
    } catch (e) {
      return false
    }
  }
}
