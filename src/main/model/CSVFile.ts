import fs from 'fs'
import { BrowserWindow } from 'electron'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import { Match } from 'chardet/lib/match'
import { Iconv } from 'iconv'
import * as channels from '@/common/channels'

const MAX_PRELOAD_FILESIZE = 200 * 1024
const DEFAULT_ENCODING = 'UTF-8'

export default class CSVFile {
  public static async open (path: string, window: BrowserWindow) {
    if (!await CSVFile.isFile(path)) return

    CSVFile.parse(path, {
      bom: true,
      delimiter: CSVFile.guessDelimiter(path),

      // eslint-disable-next-line
      relax_column_count: true,
    }, window)
  }

  public static save (path: string, data: string) {
    fs.writeFile(path, data, err => {
      throw err
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

  private static async parse (path: string, options: csvParse.Options, window: BrowserWindow) {
    try {
      const encoding = await this.detectEncoding(path)
      const iconv = new Iconv(encoding, 'UTF-8')

      fs.createReadStream(path)
        .pipe(iconv)
        .pipe(csvParse(options, (error: Error | undefined, data: string[][]) => {
          if (error) throw error
          const payload: channels.FILE_LOADED = { path, data }
          window.webContents.send(channels.FILE_LOADED, payload)
        }))
    } catch (e) {
      console.error(e)
    }
  }
}
