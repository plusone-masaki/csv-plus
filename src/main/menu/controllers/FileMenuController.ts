import {
  dialog,
  BrowserWindow,
  MenuItem,
} from 'electron'
import * as fs from 'fs'
import * as pathModule from 'path'
import * as channels from '@/common/channels'
import { FILE_FILTERS, FILE_FILTERS_TSV } from '@/common/files'
import { FileMeta } from '@/@types/types'
import CSVFile from '@/main/modules/CSVFile'
import History from '@/main/modules/History'

const csvFile = new CSVFile()

export default class FileMenuController {
  public static newFile (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_NEW)
  }

  public static open (window: BrowserWindow): void
  public static open (menu: MenuItem, window?: BrowserWindow): void

  /**
   * [ファイルを開く]
   *
   * @param {MenuItem|BrowserWindow} menu
   * @param {BrowserWindow|undefined} window
   */
  public static open (menu: MenuItem|BrowserWindow, window?: BrowserWindow) {
    window = window || menu as BrowserWindow

    const files = dialog.showOpenDialogSync(window, {
      defaultPath: History.recentDirectory,
      properties: ['openFile', 'multiSelections'],
      filters: FILE_FILTERS,
    })
    if (!files) return

    files.forEach((path: string) => {
      csvFile
        .setWindow(window as BrowserWindow)
        .open(path)
        .then(() => {
          History.recentDirectory = pathModule.dirname(path)
        })
    })
  }

  /**
   * 「最近開いたファイル」
   *
   * @param menu
   * @param window
   */
  public static openRecent (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    return csvFile.setWindow(window as BrowserWindow).open(menu.label)
  }

  /**
   * 「最近開いたファイル > 履歴の消去」
   */
  public static clearRecent () {
    History.clearRecentDocuments()
  }

  /**
   * [上書き保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static save (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_SAVE)
  }

  /**
   * [名前を付けて保存]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static saveAs (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_SAVE_AS)
  }

  /**
   * [印刷]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static print (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_PRINT)
  }

  /**
   * [設定]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   * @todo 設定画面のHTML作成
   */
  public static async openSettingsWindow (menu: MenuItem, window: BrowserWindow) {
    const settings = new BrowserWindow({
      parent: window,
      title: '設定',
      width: 640,
      height: 480,
      resizable: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: false,
      },
    })
    settings.menuBarVisible = false

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await settings.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string + 'settings')
      if (!process.env.IS_TEST) settings.webContents.openDevTools()
    } else {
      await settings.loadURL('app://./settings.html')
    }
  }

  /**
   * 保存処理の実行
   *
   * @param {string} channelName
   * @param {{ path: string, data: string }} file
   * @param {BrowserWindow} window
   */
  public static executeSave (channelName: string, file: channels.FILE_SAVE, window: BrowserWindow): boolean {
    const meta = JSON.parse(file.meta) as FileMeta
    switch (channelName) {
      case channels.FILE_SAVE:
        if (!FileMenuController._fileExists(file.path)) file.path = FileMenuController._selectPath(window, meta)
        break
      case channels.FILE_SAVE_AS:
        file.path = FileMenuController._selectPath(window, meta, FileMenuController._fileExists(file.path) ? file.path : undefined)
        break
    }

    if (!file.path) return false

    try {
      const fileMeta = JSON.parse(file.meta)
      csvFile.save(file.path, file.data, fileMeta)
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
   * @param meta
   * @param {string|undefined} path
   * @return {string}
   */
  private static _selectPath (window: BrowserWindow, meta: FileMeta, path?: string): string {
    return dialog.showSaveDialogSync(window, {
      title: '名前を付けて保存',
      defaultPath: path || History.recentDirectory,
      filters: meta.delimiter === '\t' ? FILE_FILTERS_TSV : FILE_FILTERS,
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
