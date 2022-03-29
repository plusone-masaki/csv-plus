import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'
import { EventEmitter } from 'events'

interface RecentDocument {
  path: string
  timestamp: number
}

const isMac = process.platform === 'darwin'

export default class History extends EventEmitter {
  private _recentDocuments: RecentDocument[] = []
  public recentDirectory: string
  public readonly tabHistory: string[] = []

  public constructor () {
    super()
    this.recentDirectory = this._loadPersistentHistory('recent-directory') || app.getPath('documents')
    this._recentDocuments = JSON.parse(this._loadPersistentHistory('recent-documents.json') || '[]')
    this.tabHistory = JSON.parse(this._loadPersistentHistory('tab-history.json') || '[]')
  }

  /**
   * 最近開いたファイル
   */
  public get recentDocuments (): RecentDocument[] {
    return this._recentDocuments
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
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

  /**
   * [最後に使ったフォルダ]の情報をファイルに保存
   */
  public persistentRecentDirectory (): void {
    this.persistentHistory('recent-directory', this.recentDirectory)
  }

  /**
   * [最近開いたファイル]の情報をファイルに保存
   */
  public persistentRecentDocuments (): void {
    this.persistentHistory('recent-documents.json', JSON.stringify(this._recentDocuments))
  }

  /**
   * [開いているタブ]の情報をファイルに保存
   */
  public persistentTabHistory (paths: string): void {
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
      path.join(app.getPath('userData'), 'history', filename),
      data,
    )
  }
}
