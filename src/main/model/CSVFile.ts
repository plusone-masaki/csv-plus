import fs from 'fs'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import { Match } from 'chardet/lib/match'
import File from './interface/File'

const MAX_PRELOAD_FILESIZE = 1024 * 1024
const DEFAULT_ENCODING = 'UTF-8'

type Callback = (data: any[]) => void

export default class CSVFile extends File {
  public static async open (path: string, callback?: Callback) {
    if (!await CSVFile.isFile(path)) return

    const delimiter = CSVFile.guessDelimiter(path)
    const encoding = await CSVFile.detectEncoding(path)

    CSVFile.parse(path, {
      delimiter,
      encoding,
      relax_column_count: true,
    }, callback)
  }

  public static save<T> (path: string, data: Array<T>) {}

  /**
   * 渡された文字列がファイルパスかどうかチェックする
   *
   * @private
   * @param {string} path
   * @return {Promise<boolean>}
   */
  private static async isFile (path: string) {
    return new Promise<boolean>((resolve, reject) => {
      fs.stat(path, (error: Error|null, stats: fs.Stats) => {
        if (error) reject(error)
        resolve(stats.isFile())
      })
    })
  }

  /**
   * 文字コード判別
   * 最大1MBまでファイルを読み込んで判定する
   *
   * @private
   * @param {string} path
   * @return {Promise<string>}
   */
  private static async detectEncoding (path: string): Promise<string> {
    const encoding = await chardet.detectFile(path, { sampleSize: MAX_PRELOAD_FILESIZE })

    if (typeof encoding === 'string') return encoding

    if (!!encoding) {
      const match = encoding.reduce((acc: Match, encode: Match) => acc && acc.confidence > encode.confidence ? acc : encode)
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
  private static guessDelimiter (path: string) {
    const extension = path.split('.').pop()
    switch (extension) {
      case 'tsv': return '\t'
      case 'env': return '='
      case 'csv':
      default: return ','
    }
  }

  private static parse (path: string, options: csvParse.Options, callback?: Callback) {
    fs.createReadStream(path)
      .pipe(csvParse(options, (error: Error | undefined, data: any[]) => {
        if (error) throw error
        if (callback) callback(data)
      }))
  }
}
