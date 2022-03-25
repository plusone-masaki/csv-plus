import {
  dialog,
  BrowserWindow,
  MenuItem,
} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as channels from '@/assets/constants/channels'
import { FILE_FILTERS, FILE_FILTERS_TSV } from '@/assets/constants/files'
import { FileMeta } from '@/@types/types'
import { csvFile } from '@/main/modules/CSVFile'
import { history } from '@/main/modules/History'
import { menu } from '@/main/menu'

const MAX_HISTORY_LENGTH = 10
const isMac = process.platform === 'darwin'

export default class FileMenuController {
  /**
   * [新規作成]
   */
  public static newFile (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_NEW)
  }

  /**
   * [ファイルを開く]
   */
  public static open (window: BrowserWindow): void
  public static open (menu: MenuItem, window?: BrowserWindow): void
  public static open (menu: MenuItem|BrowserWindow, window?: BrowserWindow) {
    window = window || menu as BrowserWindow

    const files = dialog.showOpenDialogSync(window, {
      defaultPath: history.recentDirectory,
      properties: ['openFile', 'multiSelections'],
      filters: FILE_FILTERS,
    })
    if (!files) return

    files.forEach((filepath: string) => {
      csvFile
        .load(filepath)
        .then(() => {
          history.recentDirectory = path.dirname(filepath)
        })
    })
  }

  /**
   * 「最近開いたファイル」
   */
  public static openRecent (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    return csvFile.load(menu.label)
  }

  /**
   * 「最近開いたファイル > 履歴の消去」
   */
  public static clearRecent () {
    history.clearRecentDocuments()
    const recentDocumentsMenu = menu.getMenuItemById('recentDocuments')
    recentDocumentsMenu!.submenu!.items
      .forEach((item, index, items) => {
        if (index !== (items.length - 1)) item.visible = false
      })
  }

  /**
   * [上書き保存]
   */
  public static save (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_SAVE)
  }

  /**
   * [名前を付けて保存]
   */
  public static saveAs (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.FILE_SAVE_AS)
  }

  /**
   * [印刷]
   */
  public static print (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_PRINT)
  }

  /**
   * [設定]
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
      console.log('data', file.data)
      csvFile.save(file.path, file.data, fileMeta)
      window.webContents.send(channels.FILE_SAVE_COMPLETE, file.path)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * 「最近開いたファイル」に項目を追加
   */
  public static addRecentDocument (filepath: string) {
    history.addRecentDocument(filepath)

    if (isMac) return

    const recentDocument = new MenuItem({
      label: filepath,
      click: FileMenuController.openRecent,
    })

    const menuItem = menu.getMenuItemById('recentDocuments')
    if (!menuItem || !menuItem.submenu) return

    let count = 0
    menuItem.submenu.insert(0, recentDocument)
    menuItem.submenu.items.forEach((item, index, items) => {
      if (count && item.label === filepath) item.visible = false
      if (item.visible) count++
      if (count > MAX_HISTORY_LENGTH && index < (items.length - 1)) item.visible = false
    })
  }

  /**
   * 「最近開いたファイル」から項目を削除
   */
  public static removeRecentDocument (filepath: string) {
    const menuItem = menu.getMenuItemById('recentDocuments')
    if (!menuItem || !menuItem.submenu) return

    menuItem.submenu.items.forEach((item) => {
      if (item.label === filepath) item.visible = false
    })
  }

  /**
   * 保存する場所を選択
   */
  private static _selectPath (window: BrowserWindow, meta: FileMeta, filepath?: string): string {
    return dialog.showSaveDialogSync(window, {
      title: '名前を付けて保存',
      defaultPath: filepath || history.recentDirectory,
      filters: meta.delimiter === '\t' ? FILE_FILTERS_TSV : FILE_FILTERS,
      properties: [
        'createDirectory',
        'showOverwriteConfirmation',
      ],
    }) || ''
  }

  /**
   * ファイルの存在確認
   */
  private static _fileExists (filepath: string): boolean {
    try {
      return fs.statSync(filepath).isFile()
    } catch (e) {
      return false
    }
  }
}
