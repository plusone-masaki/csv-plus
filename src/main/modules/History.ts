import * as fs from 'fs'
import * as pathModule from 'path'
import { app, MenuItem } from 'electron'
import { menu } from '@/main/menu'
import FileMenuController from '@/main/menu/controllers/FileMenuController'
import path from 'path'

interface RecentDocument {
  path: string
  timestamp: number
}

const MAX_HISTORY_LENGTH = 10

const isMac = process.platform === 'darwin'

class History {
  private _recentDirectory: string = app.getPath('documents')
  private _recentDocuments: RecentDocument[] = []
  private _tabHistory: string[] = []

  public constructor () {
    if (isMac) return

    this._loadPersistentHistory('recent-directory').then(data => { this._recentDirectory = data })
    this._loadPersistentHistory('recent-documents.json').then(data => { this._recentDocuments = JSON.parse(data) })
    this._loadPersistentHistory('tab-history.json').then(data => { this._tabHistory = JSON.parse(data) })
  }

  public get recentDirectory (): string {
    return this._recentDirectory
  }

  public set recentDirectory (path: string) {
    this._recentDirectory = path
    this.persistentHistory('recent-directory', path)
  }

  /**
   * [最近開いたファイル]の一覧
   *
   * @return {MenuItem[]}
   */
  public get recentDocuments (): MenuItem[] {
    return this._recentDocuments
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(doc => new MenuItem({
        label: doc.path,
        click: FileMenuController.openRecent,
      }))
  }

  public get tabHistory (): string[] {
    return this._tabHistory
  }

  /**
   * [最近開いたファイル]を追加
   */
  public addRecentDocument (path: string): void {
    if (isMac) return app.addRecentDocument(path)

    const now = new Date()
    const doc = this._recentDocuments.find(doc => doc.path === path)
    if (doc) {
      doc.timestamp = now.getTime()
    } else {
      const newDoc = { path: path, timestamp: now.getTime() }
      this._recentDocuments.unshift(newDoc)
    }
    this._recentDocuments.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
    this.persistentRecentDocuments()

    // メニュー項目への追加
    const menuItem = menu.getMenuItemById('recentDocuments')
    if (!menuItem || !menuItem.submenu) return

    const recentDocument = new MenuItem({
      label: path,
      click: FileMenuController.openRecent,
    })

    let count = 0
    menuItem.submenu.insert(0, recentDocument)
    menuItem.submenu.items.forEach((item, index, items) => {
      if (count && item.label === path) item.visible = false
      if (item.visible) count++
      if (count > MAX_HISTORY_LENGTH && index < (items.length - 1)) item.visible = false
    })
  }

  public persistentRecentDocuments () {
    this.persistentHistory('recent-documents.json', JSON.stringify(this._recentDocuments))
  }

  public persistentTabHistory (paths: string) {
    this.persistentHistory('tab-history.json', paths)
  }

  /**
   * [最近開いたファイル]の履歴削除
   */
  public clearRecentDocuments (): void {
    this._recentDocuments = []
    this.persistentRecentDocuments()

    const recentDocumentsMenu = menu.getMenuItemById('recentDocuments')
    recentDocumentsMenu!.submenu!.items
      .forEach((item, index, items) => {
        if (index !== (items.length - 1)) item.visible = false
      })
  }

  private _loadPersistentHistory (filename: string): Promise<string> {
    return new Promise(resolve => {
      fs.readFile(
        path.join(app.getPath('userData'), 'history', filename),
        { encoding: 'utf8' },
        (err, data) => resolve((err || !data) ? '' : data.toString()))
    })
  }

  /**
   * 履歴データの永続化
   */
  public persistentHistory (filename: string, data: string) {
    fs.writeFileSync(
      pathModule.join(app.getPath('userData'), 'history', filename),
      data,
    )
  }
}

export default new History()
