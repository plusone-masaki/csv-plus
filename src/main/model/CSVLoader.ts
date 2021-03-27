import os from 'os'
import fs from 'fs'
import Stream, { Transform } from 'stream'
import { EventEmitter } from 'events'
import { BrowserWindow, dialog } from 'electron'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import { Match } from 'chardet/lib/match'
import * as channels from '@/common/channels'
import { FileMeta } from '@/common/types'

// const MAX_PRELOAD_FILESIZE = 200 * 1024
const DEFAULT_ENCODING = 'UTF-8'

const transformOptions = (): Stream.TransformOptions => ({
  transform (chunk: Buffer, encoding: BufferEncoding, next: Stream.TransformCallback) {
    this.push(chunk)
    next()
  },
})

export default class CSVLoader {
  readonly ready?: Promise<boolean>

  private event: EventEmitter = new EventEmitter()
  private window: BrowserWindow|null = null
  private meta: FileMeta = {
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '"',
    encoding: DEFAULT_ENCODING,
    linefeed: os.EOL,
  }

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
   * 文字コードの判別
   *
   * @private
   * @return {Stream.Transform}
   */
  private detectEncoding (): Stream.Transform {
    const stream = new Stream.Transform({
      transform (chunk: Buffer, encoding: BufferEncoding, next: Stream.TransformCallback) {
        this.push(chunk)
        next()
      },
    })
    stream.once('data', (chunk: Buffer) => {
      const candidates = chardet.analyse(chunk)
      if (candidates.some(match => match.name === DEFAULT_ENCODING)) {
        this.meta.encoding = DEFAULT_ENCODING
      } else {
        const match = candidates.reduce((acc: Match, encode: Match) => acc && acc.confidence >= encode.confidence ? acc : encode)
        this.meta.encoding = match.name
      }
    })
    return stream
  }

  /**
   * 改行コードの判別
   *
   * @private
   * @return {Stream.Transform}
   */
  private detectLinefeed (): Stream.Transform {
    let data = ''
    const stream = new Stream.Transform({
      transform (chunk: Buffer, encoding: BufferEncoding, next: Stream.TransformCallback) {
        data += chunk
        this.push(chunk)
        next()
      },
    })
    stream.on('end', () => {
      let linefeed = ''
      if (data.indexOf('\r') !== -1) linefeed += 'CR'
      if (data.indexOf('\n') !== -1) linefeed += 'LF'
      this.meta.linefeed = linefeed || os.EOL
    })
    return stream
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
      const options: csvParse.Options = {
        bom: true,
        delimiter: this.meta.delimiter = CSVLoader.guessDelimiter(path),
        relaxColumnCount: true,
      }

      fs.createReadStream(path)
        .pipe(this.detectEncoding())
        .pipe(iconv.decodeStream(this.meta.encoding))
        .pipe(this.detectLinefeed())
        .pipe(csvParse(options, async (error: Error | undefined, data: string[][]) => {
          if (error) {
            dialog.showErrorBox('ファイルを開けませんでした', 'ファイル形式が間違っていないかご確認下さい')
            return
          }

          const payload: channels.FILE_LOADED = {
            label: path.split(process.platform === 'win32' ? '\\' : '/').pop() || '',
            path,
            data,
            meta: this.meta,
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
