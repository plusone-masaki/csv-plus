import fs from 'fs'
import Stream, { Transform } from 'stream'
import { EventEmitter } from 'events'
import { BrowserWindow, dialog } from 'electron'
import csvParse from 'csv-parse'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import * as hasBom from 'has-bom'
import { Match } from 'chardet/lib/match'
import { FileMeta, Linefeed, SupportedEncoding } from '@/common/types'
import * as channels from '@/common/channels'
import * as files from '@/common/files'
import { defaultLinefeed } from '@/common/plugins/helpers'
import History from '@/main/models/History'

const DEFAULT_ENCODING = 'UTF-8'

const defaultFileMeta = (): FileMeta => ({
  delimiter: '',
  quoteChar: '"',
  escapeChar: '"',
  linefeed: defaultLinefeed(),
  encoding: '',
  bom: false,
})

const linefeedChar = (linefeed: string): '\r\n'|'\n' => {
  switch (linefeed) {
    case 'CRLF': return '\r\n'
    case 'LF':
    default: return '\n'
  }
}

export default class CSVFile {
  readonly _ready?: Promise<boolean>

  private _event: EventEmitter = new EventEmitter()
  private _window: BrowserWindow|null = null
  private _meta: FileMeta = defaultFileMeta()

  public constructor () {
    const event = this._event
    this._ready = new Promise(resolve => {
      event.once('ready', () => resolve(true))
    })
  }

  public initialize () {
    this._window = null
    this._meta = defaultFileMeta()
    return this
  }

  public setWindow (window: BrowserWindow) {
    this._window = window
    this._event.emit('ready')
    return this
  }

  public setMeta (fileMeta: FileMeta) {
    this._meta = fileMeta
    return this
  }

  public async open (path: string) {
    if (!await CSVFile._isFile(path)) throw Error('File not found.')
    await this.parse(path)

    // 最近使ったファイルに追加
    History.addRecentDocument(path)
  }

  public save (path: string, data: string, options: FileMeta) {
    const buf = iconv.encode(data.replace(/\n/g, linefeedChar(options.linefeed)), options.encoding, { addBOM: options.bom })
    fs.writeFile(path, buf, error => {
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
  private _decode (): Stream.Transform {
    const meta = this._meta
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
  private _detectLinefeed (): Stream.Transform {
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
      this._meta.linefeed = linefeed as Linefeed || defaultLinefeed()
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

  private async parse (path: string) {
    return new Promise(resolve => {
      try {
        this._meta.delimiter = this._meta.delimiter || CSVFile._guessDelimiter(path)
        const options: csvParse.Options = {
          bom: true,
          delimiter: this._meta.delimiter,
          relax: true,
          relaxColumnCount: true,
        }

        fs.createReadStream(path)
          .pipe(this._decode())
          .pipe(this._detectLinefeed())
          .pipe(csvParse(options, async (error: Error | undefined, data: string[][]) => {
            if (error) {
              console.error(error)
              dialog.showErrorBox('ファイルを開けませんでした', 'ファイル形式が間違っていないかご確認下さい')
              resolve()
            }

            // 基準を越えるサイズの場合に列幅の自動計算をキャンセル
            if (CSVFile._hasOverflow(data)) this._meta.colWidth = 120

            // メタデータの補完
            if (!this._meta.encoding) this._meta.encoding = DEFAULT_ENCODING

            const payload: channels.FILE_LOADED = {
              label: path.split(process.platform === 'win32' ? '\\' : '/').pop() || '',
              path,
              data,
              meta: this._meta,
            }

            await this._ready
            if (this._window) {
              this._window.webContents.send(channels.FILE_LOADED, payload)
            }
            resolve()
          }))
      } catch (e) {
        console.error(e)
        throw e
      }
    })
  }
}
