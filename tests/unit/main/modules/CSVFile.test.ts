import * as path from 'path'
import { csvFile } from '@/main/modules/CSVFile'
import { FileData } from '@/@types/types'

const filedir = path.resolve('tests', 'files', 'csv')

describe('CSVFile', () => {
  describe('Open 0 bytes CSV', () => {
    let payload: FileData|undefined
    const filepath = path.join(filedir, '0bytes.csv')

    beforeAll(async () => {
      payload = await csvFile.load(filepath)
    })

    test('Not an error', () => expect(payload).toBeTruthy())
    test('It has file path', () => expect(payload!.path).toContain(filepath))
    test('It is empty array', () => expect(payload!.data.length).toBe(0))
  })
  describe('Open 0 bytes TSV', () => {
    let payload: FileData|undefined
    const filepath = path.join(filedir, '0bytes.tsv')

    beforeAll(async () => {
      payload = await csvFile.load(filepath)
    })

    test('Not an error', () => expect(payload).toBeTruthy())
    test('It has file path', () => expect(payload!.path).toContain(filepath))
    test('It is empty array', () => expect(payload!.data.length).toBe(0))
  })
})
