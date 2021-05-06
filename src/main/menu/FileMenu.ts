import {
  BrowserWindow,
  MenuItem,
  dialog,
} from 'electron'
import * as fs from 'fs'
import * as channels from '@/common/channels'
import CSVLoader from '@/main/model/CSVLoader'

const csvLoader = new CSVLoader()

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

    files.forEach((path: string) => csvLoader.initialize().setWindow(window as BrowserWindow).open(path))
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
   * [印刷]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static print (menu: MenuItem, window: BrowserWindow) {
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
        nodeIntegration: true,
      },
    })
    settings.menuBarVisible = false

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await settings.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string + 'settings')
      if (!process.env.IS_TEST) settings.webContents.openDevTools()
    } else {
      settings.loadURL('app://./settings.html')
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
      const fileMeta = JSON.parse(file.meta)
      csvLoader.save(file.path, file.data, fileMeta)
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
