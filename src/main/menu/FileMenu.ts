import {
  dialog,
  BaseWindow,
  MenuItem,
  MenuItemConstructorOptions,
  Menu, BrowserWindow,
} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as channels from '@/assets/constants/channels'
import { FILE_FILTERS, FILE_FILTERS_TSV } from '@/assets/constants/files'
import { FileMeta } from '@/@types/types'
import { menu } from '@/main/menu/index'
import { getModule } from '@/main/modules'

const MAX_HISTORY_LENGTH = 10
const isMac = process.platform === 'darwin'

const csvFile = getModule('csvFile')
const history = getModule('history')

export default class FileMenu {
  public static createMenu () {
    const menu = new FileMenu()

    const isMac = process.platform === 'darwin'
    const history = getModule('history')
    const recentDocuments: () => MenuItemConstructorOptions = isMac
      ? () => ({
          id: 'recentDocuments',
          role: 'recentDocuments',
          label: '最近開いたファイル',
          submenu: [{
            label: '履歴を消去',
            role: 'clearRecentDocuments',
          }],
        })
      : () => {
          const submenu = new Menu()
          history.recentDocuments.forEach(doc => submenu.append(new MenuItem({
            label: doc.path,
            click: menu.openRecent,
          })))
          submenu.append(new MenuItem({
            label: '履歴を消去',
            click: menu.clearRecent,
          }))
          return {
            id: 'recentDocuments',
            label: '最近開いたファイル',
            submenu,
          }
        }

    return new MenuItem({
      label: 'ファイル',
      submenu: [
        {
          label: '新規作成',
          accelerator: 'CmdOrCtrl+N',
          click: menu.newFile,
        },
        { type: 'separator' },
        {
          label: 'ファイルを開く',
          accelerator: 'CmdOrCtrl+O',
          click: menu.open,
        },
        recentDocuments(),
        { type: 'separator' },
        {
          label: '上書き保存',
          accelerator: 'CmdOrCtrl+S',
          click: menu.save,
        },
        {
          label: '名前を付けて保存',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: menu.saveAs,
        },
        {
          label: '印刷',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: menu.print,
        },
      ],
    })
  }

  /**
   * [新規作成]
   */
  public newFile (menu: MenuItem, window?: BaseWindow) {
    if (!window) return
    (window as BrowserWindow).webContents.send(channels.FILE_NEW)
  }

  /**
   * [ファイルを開く]
   */
  public open (window: BaseWindow): void
  public open (menu: MenuItem, window?: BaseWindow): void
  public open (menu: MenuItem|BaseWindow, window?: BaseWindow) {
    window = window || menu as BaseWindow

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
  public openRecent (menu: MenuItem, window?: BaseWindow) {
    if (!window) return
    csvFile.load(menu.label)
  }

  /**
   * 「最近開いたファイル > 履歴の消去」
   */
  public clearRecent () {
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
  public save (menu: MenuItem, window?: BaseWindow) {
    if (!window) return
    (window as BrowserWindow).webContents.send(channels.FILE_SAVE)
  }

  /**
   * [名前を付けて保存]
   */
  public saveAs (menu: MenuItem, window?: BaseWindow) {
    if (!window) return
    (window as BrowserWindow).webContents.send(channels.FILE_SAVE_AS)
  }

  /**
   * [印刷]
   */
  public print (menu: MenuItem, window?: BaseWindow) {
    if (!window) return
    (window as BrowserWindow).webContents.send(channels.MENU_PRINT)
  }

  /**
   * [設定]
   * @todo 設定画面のHTML作成
   */
  public async openSettingsWindow (menu: MenuItem, window: BaseWindow) {
    const settings = new BrowserWindow({
      parent: window,
      title: '設定',
      width: 640,
      height: 480,
      resizable: false,
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
  public executeSave (channelName: string, file: channels.FILE_SAVE, window: BaseWindow): boolean {
    const meta = JSON.parse(file.meta) as FileMeta
    switch (channelName) {
      case channels.FILE_SAVE:
        if (!this._fileExists(file.path)) file.path = this._selectPath(window, meta)
        break
      case channels.FILE_SAVE_AS:
        file.path = this._selectPath(window, meta, this._fileExists(file.path) ? file.path : undefined)
        break
    }

    if (!file.path) return false

    try {
      const fileMeta = JSON.parse(file.meta)
      csvFile.save(file.path, file.data, fileMeta)
      ;(window as BrowserWindow).webContents.send(channels.FILE_SAVE_COMPLETE, file.path)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * 「最近開いたファイル」に項目を追加
   */
  public addRecentDocument (filepath: string) {
    history.addRecentDocument(filepath)

    if (isMac) return

    const recentDocument = new MenuItem({
      label: filepath,
      click: this.openRecent,
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
  public removeRecentDocument (filepath: string) {
    const menuItem = menu.getMenuItemById('recentDocuments')
    if (!menuItem || !menuItem.submenu) return

    menuItem.submenu.items.forEach((item) => {
      if (item.label === filepath) item.visible = false
    })
  }

  /**
   * 保存する場所を選択
   */
  private _selectPath (window: BaseWindow, meta: FileMeta, filepath?: string): string {
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
  private _fileExists (filepath: string): boolean {
    try {
      return fs.statSync(filepath).isFile()
    } catch (e) {
      return false
    }
  }
}
