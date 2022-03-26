import { EventEmitter } from 'events'
import fs from 'fs'
import * as crypt from 'crypto'
import Stream from 'stream'
import csvParse, { parse } from 'csv-parse'
import hasBom from 'has-bom'
import chardet from 'chardet'
import { Match } from 'chardet/lib/match'
import { FileData, FileMeta, Linefeed, SupportedEncoding } from '@/@types/types'
import * as files from '@/assets/constants/files'
import { defaultLinefeed, linefeedChar } from '@/common/helpers'
import iconv from '@/common/plugins/iconv'

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

export default class CSVFile extends EventEmitter {
  public async load (filepath: string, meta?: FileMeta) {
    this.emit('BEFORE_LOAD', filepath)

    if (!await CSVFile._isFile(filepath)) {
      this.emit('FAILED_LOAD', filepath, 'ファイルが見つかりません。')
      return
    }

    try {
      const payload = await this._parse(filepath, meta || defaultFileMeta())
      this.emit('AFTER_LOAD', payload)
      return payload
    } catch (e) {
      console.error(e)
      this.emit('FAILED_LOAD', filepath, 'ファイル形式が間違っていないかご確認下さい。')
    }
  }

  public save (path: string, data: string, options: FileMeta) {
    this.emit('BEFORE_SAVE', path, data, options)
    const csv = data.replace(/\r\n|\r|\n/g, linefeedChar(options.linefeed))
    const buf = iconv.encode(csv, options.encoding, { addBOM: options.bom })

    fs.writeFileSync(path, buf)
    this.emit('AFTER_SAVE', path, buf)
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
        const endOfRow = chunk.lastIndexOf('\n')

        if (!meta.encoding) {
          meta.bom = !!chunk.length && hasBom(chunk)

          const candidates = chardet.analyse(chunk.slice(0, endOfRow))
          if (candidates.some(match => match.name === DEFAULT_ENCODING)) {
            meta.encoding = DEFAULT_ENCODING
          } else {
            const match = candidates.reduce((acc: Match, encode: Match) => acc && acc.confidence >= encode.confidence ? acc : encode)
            meta.encoding = ['ISO_2022_CN', 'ISO_2022_KR'].includes(match.name) ? 'UTF-8' : match.name as SupportedEncoding
          }
        }

        if (endOfRow === -1) {
          this.push(iconv.decode(Buffer.concat([buffer, chunk]), meta.encoding))
        } else {
          this.push(iconv.decode(Buffer.concat([buffer, chunk.slice(0, endOfRow)]), meta.encoding))
          buffer = chunk.slice(endOfRow)
        }
        next()
      },
      final (next: Stream.TransformCallback) {
        if (buffer.length) this.push(iconv.decode(buffer, meta.encoding))
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

  private async _parse (path: string, meta: FileMeta): Promise<FileData> {
    return new Promise((resolve, reject) => {
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
          if (error) return reject(error)

          // 基準を越えるサイズの場合に列幅の自動計算をキャンセル
          if (CSVFile._hasOverflow(data)) meta.colWidth = 200

          // メタデータの補完
          if (!meta.encoding) meta.encoding = DEFAULT_ENCODING

          // ハッシュ値の計算
          meta.hash = this.calculateHash(JSON.stringify(data))

          const payload = {
            label: path.split(process.platform === 'win32' ? '\\' : '/').pop() || '',
            path,
            data,
            meta: {
              _origin: meta,
              ...meta,
            },
          }

          resolve(payload)
        }))
    })
  }
}
