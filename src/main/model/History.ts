import * as fs from 'fs'
import * as pathModule from 'path'
import { app, MenuItem } from 'electron'
import { menu } from '@/main/menu'
import FileMenuController from '@/main/menu/controllers/FileMenuController'

interface RecentDocument {
  path: string
  timestamp: number
}

const MAX_HISTORY_LENGTH = 10

const isMac = process.platform === 'darwin'

class History {
  private _recentDocuments: RecentDocument[] = []

  public constructor () {
    if (isMac) return

    try {
      const data = fs.readFileSync(pathModule.join(app.getPath('appData'), 'recentDocuments.json'))
      this._recentDocuments = JSON.parse(data.toString()) as RecentDocument[]
    } catch (e) {
      this._recentDocuments = []
    }
  }

  /**
   * [最近開いたファイル]の一覧
   *
   * @return {MenuItem[]}
   */
  public getRecentDocuments (): MenuItem[] {
    return this._recentDocuments
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(doc => new MenuItem({
        label: doc.path,
        click: FileMenuController.openRecent,
      }))
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

    // メニュー項目の追加
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

  /**
   * [最近開いたファイル]データの永続化
   */
  public persistentRecentDocuments () {
    fs.writeFileSync(
      pathModule.join(app.getPath('appData'), 'recentDocuments.json'),
      JSON.stringify(this._recentDocuments),
    )
  }

  public clearRecentDocuments (): void {
    this._recentDocuments = []
    this.persistentRecentDocuments()

    const recentDocumentsMenu = menu.getMenuItemById('recentDocuments')
    recentDocumentsMenu!.submenu!.items
      .forEach((item, index, items) => {
        if (index !== (items.length - 1)) item.visible = false
      })
  }
}

export default new History()
