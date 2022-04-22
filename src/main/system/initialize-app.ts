import * as fs from 'fs'
import * as pathModule from 'path'
import { app } from 'electron'

// 履歴ディレクトリの作成
const historyDir = pathModule.join(app.getPath('userData'), 'history')
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir)
}

// TODO: 移行期間対応を過ぎたら削除
// root直下の履歴ファイルがあれば移動
const oldRecentDocuments = pathModule.join(app.getPath('appData'), 'recentDocuments.json')
const newRecentDocuments = pathModule.join(historyDir, 'recent-documents.json')
if (fs.existsSync(oldRecentDocuments)) {
  if (fs.existsSync(newRecentDocuments)) {
    fs.rmSync(oldRecentDocuments)
  } else {
    fs.renameSync(oldRecentDocuments, newRecentDocuments)
  }
}
const oldTabHistory = pathModule.join(app.getPath('userData'), 'tab_history.json')
const newTabHistory = pathModule.join(historyDir, 'tab-history.json')
if (fs.existsSync(oldTabHistory)) {
  if (fs.existsSync(newTabHistory)) {
    fs.rmSync(oldTabHistory)
  } else {
    fs.renameSync(oldTabHistory, newTabHistory)
  }
}
