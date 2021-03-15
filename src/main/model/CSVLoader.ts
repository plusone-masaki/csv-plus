import fs from 'fs'
import { EventEmitter } from 'events'
import { BrowserWindow, dialog } from 'electron'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import { Match } from 'chardet/lib/match'
import * as channels from '@/common/channels'
import { Options } from '@/renderer/types'

const MAX_PRELOAD_FILESIZE = 200 * 1024
const DEFAULT_ENCODING = 'UTF-8'

export default class CSVLoader {
  private ready?: Promise<boolean>
  private event: EventEmitter = new EventEmitter()
  private window: BrowserWindow|null = null

  public constructor () {
    const event = this.event
    this.ready = new Promise(resolve => {
      event.once('ready', () => resolve(true))
    })
  }

  public setWindow (window: BrowserWindow) {
    this.window = window
    this.event.emit('ready')
    return this
  }

  public async open (path: string) {
    if (!await CSVLoader.isFile(path)) throw Error('File not found.')

    await this.parse(path)
  }

  public save (path: string, data: string) {
    fs.writeFile(path, data, error => {
      if (error) throw error
    })
  }

  /**
   * 渡された文字列がファイルパスかどうかチェックする
   *
   * @private
   * @param {string} path
   * @return {Promise<boolean>}
   */
  private static async isFile (path: string): Promise<boolean> {
    try {
      fs.accessSync(path, fs.constants.F_OK)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * 文字コード判別
   * ファイルの一部を読み込んで判定する
   *
   * @private
   * @param {string} path
   * @return {Promise<string>}
   */
  private static async detectEncoding (path: string): Promise<string> {
    const encoding = await chardet.detectFile(path, { sampleSize: MAX_PRELOAD_FILESIZE })

    if (typeof encoding === 'string' && encoding === 'UTF-32BE') return DEFAULT_ENCODING
    if (typeof encoding === 'string') return encoding

    if (encoding) {
      const match = encoding.reduce((acc: Match, encode: Match) => acc && acc.confidence >= encode.confidence ? acc : encode)
      return match.name
    }

    return DEFAULT_ENCODING
  }

  /**
   * 拡張子から区切り文字を推測する
   *
   * @private
   * @param {string} path
   * @return {string}
   */
  private static guessDelimiter (path: string): string {
    const extension = path.split('.').pop()
    switch (extension) {
      case 'tsv': return '\t'
      case 'csv':
      default: return ','
    }
  }

  private async parse (path: string) {
    try {
      const encoding = await CSVLoader.detectEncoding(path)
      const options: csvParse.Options = {
        bom: true,
        delimiter: CSVLoader.guessDelimiter(path),
        relaxColumnCount: true,
      }

      fs.createReadStream(path)
        .pipe(iconv.decodeStream(encoding))
        .pipe(csvParse(options, async (error: Error | undefined, data: string[][]) => {
          if (error) {
            dialog.showErrorBox('ファイルを開けませんでした', 'ファイル形式が間違っていないかご確認下さい')
            return
          }

          const payload: channels.FILE_LOADED = {
            label: path.split(process.platform === 'win32' ? '\\' : '/').pop() || '',
            path,
            data,
            dirty: false,
            options: {
              hasHeader: false,
              delimiter: options.delimiter,
              quoteChar: '"',
              escapeChar: '"',
              encoding,
            } as Options,
            table: null,
          }

          await this.ready
          if (this.window) {
            this.window.webContents.send(channels.FILE_LOADED, payload)
          }
        }))
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
