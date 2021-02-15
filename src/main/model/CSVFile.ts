import fs from 'fs'
import { BrowserWindow, dialog, WebContents } from 'electron'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import { Match } from 'chardet/lib/match'
import * as channels from '@/common/channels'
import { Options } from '@/renderer/types'

const MAX_PRELOAD_FILESIZE = 200 * 1024
const DEFAULT_ENCODING = 'UTF-8'

export default class CSVFile {
  public static async open (path: string, window: BrowserWindow|WebContents) {
    if (!await CSVFile.isFile(path)) return

    CSVFile.parse(path, window)
  }

  public static save (path: string, data: string) {
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
    return new Promise<boolean>((resolve, reject) => {
      fs.stat(path, (error: Error|null, stats: fs.Stats) => {
        if (error) reject(error)
        resolve(stats.isFile())
      })
    })
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
      case 'env': return '='
      case 'csv':
      default: return ','
    }
  }

  private static async parse (path: string, window: BrowserWindow|WebContents) {
    try {
      const encoding = await this.detectEncoding(path)
      const options: csvParse.Options = {
        bom: true,
        delimiter: CSVFile.guessDelimiter(path),
        relaxColumnCount: true,
      }

      fs.createReadStream(path)
        .pipe(iconv.decodeStream(encoding))
        .pipe(csvParse(options, (error: Error | undefined, data: string[][]) => {
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
            } as Options,
          }

          if (window instanceof BrowserWindow) {
            window.webContents.send(channels.FILE_LOADED, payload)
          } else {
            window.send(channels.FILE_LOADED, payload)
          }
        }))
    } catch (e) {
      console.error(e)
    }
  }
}
