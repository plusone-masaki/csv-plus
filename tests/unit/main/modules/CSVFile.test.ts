import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import faker, { UsableLocale } from '@tests/utils/faker'
import iconv from '@/common/plugins/iconv'
import { stringify } from 'csv-stringify/lib/sync'
import { csvFile } from '@/main/modules/CSVFile'
import { FileData, FileMeta, SupportedEncoding } from '@/@types/types'
import { defaultLinefeed } from '@/common/helpers'

const testData = [
  ['CSV', 'csv', ','],
  ['TSV', 'tsv', '\t'],
  ['Pipe(|)', 'psv', '|'],
]
const encodings: [SupportedEncoding, UsableLocale][] = [
  ['UTF-8', 'en'],
  ['UTF-16', 'en'],
  ['UTF-16LE', 'en'],
  ['UTF-16BE', 'en'],
  ['UTF-32', 'en'],
  ['UTF-32LE', 'en'],
  ['UTF-32BE', 'en'],
  ['Shift_JIS', 'ja'],
  ['Big5', 'en'],
  ['EUC-JP', 'ja'],
  ['EUC-KR', 'ko'],
  ['GB18030', 'en'],
  ['ISO_2022_JP', 'ja'],
  ['ISO-8859-1', 'en'],
  ['ISO-8859-2', 'en'],
  ['ISO-8859-5', 'en'],
  ['ISO-8859-6', 'en'],
  ['ISO-8859-7', 'en'],
  ['ISO-8859-8', 'en'],
  ['ISO-8859-9', 'en'],
  ['windows-1250', 'en'],
  ['windows-1251', 'en'],
  ['windows-1252', 'en'],
  ['windows-1253', 'en'],
  ['windows-1254', 'en'],
  ['windows-1255', 'en'],
  ['windows-1256', 'en'],
  ['KOI8-R', 'en'],
]

describe('Module: [CSVFile]', () => {
  describe.each(testData)('[%s] file', (label, ext, delimiter) => {
    describe('Method: load', () => {
      describe('Open 0 bytes file', () => {
        let payload: FileData|undefined
        const filepath = path.join(os.tmpdir(), `0bytes.${ext}`)
        const defaultDelimiter = ['csv', 'tsv'].includes(ext) ? delimiter : ','

        beforeAll(async () => {
          await fs.promises.writeFile(filepath, '')
          payload = await csvFile.load(filepath)
        })

        test('Not has error.', () => expect(payload).toBeTruthy())
        test('It has file path.', () => expect(payload!.path).toContain(filepath))
        test('It is empty array.', () => expect(payload!.data.length).toBe(0))
        test(`Delimiter is [${defaultDelimiter}].`, () => expect(payload!.meta.delimiter).toBe(defaultDelimiter))
        test('Quote char is ["].', () => expect(payload!.meta.quoteChar).toBe('"'))
        test('Escape char is ["].', () => expect(payload!.meta.quoteChar).toBe('"'))
        test('Escape char is ["].', () => expect(payload!.meta.escapeChar).toBe('"'))
        test(`Line separator is "${defaultLinefeed()}".`, () => expect(payload!.meta.linefeed).toBe(defaultLinefeed()))
        test('Encoding is "UTF-8".', () => expect(payload!.meta.encoding).toBe('UTF-8'))
        test('Not has BOM.', () => expect(payload!.meta.bom).toBe(false))
      })

      describe('Encoding', () => {
        describe.each(encodings)('%s', (encoding, lang) => {
          let payload: FileData|undefined
          faker.locale = lang

          const filepath = path.join(os.tmpdir(), `${encoding}.${ext}`)
          const data = [['name', 'email', 'tel']]
          for (let i = 0; i < 3; i++) {
            data.push([
              `${faker.name.firstName()} ${faker.name.lastName()}`,
              faker.internet.email(),
              faker.phone.phoneNumber(),
            ])
          }
          beforeAll(() => {
            fs.promises.writeFile(filepath, iconv.encode(stringify(data, { delimiter }), encoding))
          })

          describe('Analysis without setting metadata', () => {
            beforeAll(async () => {
              payload = await csvFile.load(filepath)
            })

            test('Not has error.', () => expect(payload).toBeTruthy())
            test('It is a possibility of garbled characters.', () => undefined)
            test('Encoding guessing may be wrong.', () => undefined)
          })

          describe('Analysis with setting metadata', () => {
            beforeAll(async () => {
              const metadata: FileMeta = {
                delimiter: delimiter,
                quoteChar: '"',
                escapeChar: '"',
                linefeed: defaultLinefeed(),
                encoding: encoding,
                bom: false,
                hash: '',
              }
              payload = await csvFile.load(filepath, metadata)
            })

            test('Not has error.', () => expect(payload).toBeTruthy())
            test('Data was restored.', () => expect(payload!.data).toStrictEqual(data))
            test(`Guessed to be ${encoding} encoding.`, () => expect(payload!.meta.encoding).toBe(encoding))
          })
        })
      })
    })
  })
})
