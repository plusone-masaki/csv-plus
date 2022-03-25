import * as fs from 'fs'
import * as pathModule from 'path'
import { app } from 'electron'
import path from 'path'
import { EventEmitter } from 'events'

interface RecentDocument {
  path: string
  timestamp: number
}

const isMac = process.platform === 'darwin'

class History extends EventEmitter {
  private _recentDirectory: string = app.getPath('documents')
  private _recentDocuments: RecentDocument[] = []
  private _tabHistory: string[] = []

  public constructor () {
    super()
    this._recentDirectory = this._loadPersistentHistory('recent-directory')
    this._recentDocuments = JSON.parse(this._loadPersistentHistory('recent-documents.json'))
    this._tabHistory = JSON.parse(this._loadPersistentHistory('tab-history.json'))
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
   */
  public get recentDocuments (): RecentDocument[] {
    return this._recentDocuments
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
  }

  public get tabHistory (): string[] {
    return this._tabHistory
  }

  /**
   * [最近開いたファイル]を追加
   */
  public addRecentDocument (filepath: string): void {
    if (isMac) {
      return app.addRecentDocument(filepath)
    }
    this.emit('ADD_RECENT_DOC', filepath)

    const now = new Date()
    const doc = this._recentDocuments.find(doc => doc.path === filepath)
    if (doc) {
      doc.timestamp = now.getTime()
    } else {
      const newDoc = { path: filepath, timestamp: now.getTime() }
      this._recentDocuments.unshift(newDoc)
    }
    this._recentDocuments = this._recentDocuments.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
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
    this.emit('CLEAR_RECENT_DOC')
  }

  private _loadPersistentHistory (filename: string): string {
    return fs.readFileSync(path.join(app.getPath('userData'), 'history', filename), { encoding: 'utf8' })
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

export const history = new History()
