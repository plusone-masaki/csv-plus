import fs from 'fs'
import * as crypt from 'crypto'
import Stream from 'stream'
import { EventEmitter } from 'events'
import { BrowserWindow, dialog } from 'electron'
import csvParse, { parse } from 'csv-parse'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import * as hasBom from 'has-bom'
import { Match } from 'chardet/lib/match'
import { FileMeta, Linefeed, SupportedEncoding } from '@/@types/types'
import * as channels from '@/common/channels'
import * as files from '@/common/files'
import { defaultLinefeed, linefeedChar } from '@/common/helpers'
import History from '@/main/models/History'

const DEFAULT_ENCODING = 'UTF-8'

const defaultFileMeta = (): FileMeta => ({
  delimiter: '',
  quoteChar: '"',
  escapeChar: '"',
  linefeed: defaultLinefeed(),
  encoding: '',
  bom: false,
  hash: '',
})

export default class CSVFile {
  readonly _ready?: Promise<boolean>

  private _event: EventEmitter = new EventEmitter()
  private _window: BrowserWindow|null = null

  public constructor () {
    const event = this._event
    this._ready = new Promise(resolve => {
      event.once('ready', () => resolve(true))
    })
  }

  public setWindow (window: BrowserWindow) {
    this._window = window
    this._event.emit('ready')
    return this
  }

  public async open (path: string, meta?: FileMeta) {
    if (!await CSVFile._isFile(path)) {
      dialog.showErrorBox('ファイルを開けませんでした', `ファイルが見つかりません。\n${path}`)
      throw Error('File not found.')
    }
    await this.parse(path, meta || defaultFileMeta())

    // 最近使ったファイルに追加
    History.addRecentDocument(path)
  }

  public save (path: string, data: string, options: FileMeta) {
    const csv = data.replace(/\r\n|\r|\n/g, linefeedChar(options.linefeed))
    const buf = iconv.encode(csv, options.encoding, { addBOM: options.bom })

    fs.writeFile(path, buf, error => {
      if (error) throw error
    })
  }

  public calculateHash (data: string): string {
    const hash = crypt.createHash('md5')
    hash.update(data)
    return hash.digest('hex')
  }

  /**
   * 渡された文字列がファイルパスかどうかチェックする
   *
   * @private
   * @param {string} path
   * @return {Promise<boolean>}
   */
  private static async _isFile (path: string): Promise<boolean> {
    try {
      fs.accessSync(path, fs.constants.F_OK)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * 文字コードの変換
   *
   * @private
   * @return {Stream.Transform}
   */
  private _decode (meta: FileMeta): Stream.Transform {
    let buffer: Buffer = Buffer.from('')
    return new Stream.Transform({
      transform (chunk: Buffer, _: BufferEncoding, next: Stream.TransformCallback) {
        if (!meta.encoding) {
          meta.bom = !!chunk.length && hasBom(chunk)

          const candidates = chardet.analyse(chunk)
          if (candidates.some(match => match.name === DEFAULT_ENCODING)) {
            meta.encoding = DEFAULT_ENCODING
          } else {
            const match = candidates.reduce((acc: Match, encode: Match) => acc && acc.confidence >= encode.confidence ? acc : encode)
            meta.encoding = match.name as SupportedEncoding
          }
        }

        const endOfRow = chunk.lastIndexOf('\n')
        this.push(iconv.decode(Buffer.concat([buffer, chunk.slice(0, endOfRow)]), meta.encoding))
        buffer = chunk.slice(endOfRow)
        next()
      },
      final (next: Stream.TransformCallback) {
        this.push(iconv.decode(buffer, meta.encoding))
        next()
      },
    })
  }

  /**
   * 改行コードの判別
   *
   * @private
   * @return {Stream.Transform}
   */
  private _detectLinefeed (meta: FileMeta): Stream.Transform {
    let linefeed = ''
    const stream = new Stream.Transform({
      transform (chunk: Buffer, encoding: BufferEncoding, next: Stream.TransformCallback) {
        if (!linefeed) {
          if (chunk.indexOf('\r\n') !== -1) linefeed = 'CRLF'
          else if (chunk.indexOf('\n') !== -1) linefeed = 'LF'
        }
        next(null, chunk)
      },
    })

    stream.on('end', () => {
      meta.linefeed = linefeed as Linefeed || defaultLinefeed()
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
  private static _guessDelimiter (path: string): string {
    const extension = path.split('.').pop()
    switch (extension) {
      case 'tsv': return '\t'
      case 'csv':
      default: return ','
    }
  }

  private static _hasOverflow (data: string[][]) {
    return data.length > files.MAX_ROW_LENGTH ||
      data.some(cols => cols.length > files.MAX_COL_LENGTH)
  }

  private async parse (path: string, meta: FileMeta) {
    return new Promise(resolve => {
      try {
        meta.delimiter = meta.delimiter || CSVFile._guessDelimiter(path)
        const options: csvParse.Options = {
          bom: true,
          delimiter: meta.delimiter,
          relaxColumnCount: true,
          relaxQuotes: true,
        }

        fs.createReadStream(path)
          .pipe(this._decode(meta))
          .pipe(this._detectLinefeed(meta))
          .pipe(parse(options, async (error: Error | undefined, data: string[][]) => {
            if (error) {
              console.error(error)
              dialog.showErrorBox('ファイルを開けませんでした', 'ファイル形式が間違っていないかご確認下さい')
              resolve(null)
            }

            // 基準を越えるサイズの場合に列幅の自動計算をキャンセル
            if (CSVFile._hasOverflow(data)) meta.colWidth = 200

            // メタデータの補完
            if (!meta.encoding) meta.encoding = DEFAULT_ENCODING

            // ハッシュ値の計算
            meta.hash = this.calculateHash(JSON.stringify(data))

            const payload: channels.FILE_LOADED = {
              label: path.split(process.platform === 'win32' ? '\\' : '/').pop() || '',
              path,
              data,
              meta: {
                _origin: meta,
                ...meta,
              },
            }

            await this._ready
            if (this._window) {
              this._window.webContents.send(channels.FILE_LOADED, payload)
            }
            resolve(null)
          }))
      } catch (e) {
        console.error(e)
        throw e
      }
    })
  }
}
