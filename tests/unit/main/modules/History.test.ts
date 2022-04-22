import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import History from '@/main/modules/History'

let history: History

describe('Module: [History]', () => {
  beforeAll(() => {
    fs.mkdirSync(path.resolve(os.tmpdir(), 'test', 'userData', 'history'), { recursive: true })
    fs.writeFileSync(path.resolve(os.tmpdir(), 'test', 'userData', 'history', 'recent-directory'), '')
    fs.writeFileSync(path.resolve(os.tmpdir(), 'test', 'userData', 'history', 'recent-documents.json'), '[]')
    fs.writeFileSync(path.resolve(os.tmpdir(), 'test', 'userData', 'history', 'tab-history.json'), '[]')
  })
  afterAll(() => {
    fs.rmSync(path.join(os.tmpdir(), 'test', 'userData', 'history'), { recursive: true })
  })

  describe('Directory', () => {
    const filepath = path.resolve(os.tmpdir(), 'test', 'userData', 'history', 'recent-directory')

    describe('Default path', () => {
      beforeAll(() => {
        fs.writeFileSync(filepath, '')
        history = new History()
      })

      test('Default path is "Documents".', () => {
        expect(history.recentDirectory).toBe(path.resolve(os.tmpdir(), 'test', 'documents'))
      })
    })

    describe('Set path.', () => {
      beforeAll(() => {
        fs.writeFileSync(filepath, path.resolve(os.tmpdir(), 'test', 'some', 'filepath.csv'))
        history = new History()
      })

      test('The set path is read.', () => {
        expect(history.recentDirectory).toBe(path.resolve(os.tmpdir(), 'test', 'some', 'filepath.csv'))
      })
    })

    describe('Persistent path.', () => {
      const data = path.resolve(os.tmpdir(), 'path', 'to', 'hoge.csv')
      beforeAll(() => {
        fs.writeFileSync(filepath, '')
        history = new History()
        history.recentDirectory = data
        history.persistentRecentDirectory()
      })

      test('The set path is written.', () => {
        expect(fs.readFileSync(filepath, { encoding: 'utf8' })).toBe(data)
      })
    })
  })

  describe('Recent documents', () => {
    const filepath = path.resolve(os.tmpdir(), 'test', 'userData', 'history', 'recent-documents.json')

    describe('Default', () => {
      beforeAll(() => {
        fs.writeFileSync(filepath, '')
        history = new History()
      })

      test('Default "recentDocuments" is empty array.', () => {
        expect(history.recentDocuments).toStrictEqual([])
      })
    })

    describe('Set path.', () => {
      const data = [
        path.resolve(os.tmpdir(), 'test', 'some/hoge.csv'),
        path.resolve(os.tmpdir(), 'test', 'some/fuga.csv'),
        path.resolve(os.tmpdir(), 'test', 'some/moge.csv'),
      ]

      beforeAll(() => {
        fs.writeFileSync(filepath, JSON.stringify(data))
        history = new History()
      })

      test('The set path is written.', () => {
        expect(history.recentDocuments).toStrictEqual(data)
      })
    })
  })
  // TODO: tab-history
})
