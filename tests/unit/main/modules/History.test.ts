import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import History from '@/main/modules/History'

let history: History

describe('Module: [History]', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(os.tmpdir(), 'test', 'userData', 'history'), { recursive: true })
    fs.writeFileSync(path.join(os.tmpdir(), 'test', 'userData', 'history', 'recent-directory'), '')
    fs.writeFileSync(path.join(os.tmpdir(), 'test', 'userData', 'history', 'recent-documents.json'), '[]')
    fs.writeFileSync(path.join(os.tmpdir(), 'test', 'userData', 'history', 'tab-history.json'), '[]')
  })
  afterAll(() => {
    fs.rmSync(path.join(os.tmpdir(), 'test', 'userData', 'history'), { recursive: true })
  })

  describe('Directory', () => {
    const filepath = path.join(os.tmpdir(), 'test', 'userData', 'history', 'recent-directory')

    describe('Default path', () => {
      beforeAll(() => {
        fs.writeFileSync(filepath, '')
        history = new History()
      })

      test('Default path is "Documents".', () => {
        expect(history.recentDirectory).toBe(path.join(os.tmpdir(), 'test', 'documents'))
      })
    })

    describe('Set path.', () => {
      beforeAll(() => {
        fs.writeFileSync(filepath, path.join(os.tmpdir(), 'test', 'some/filepath.csv'))
        history = new History()
      })

      test('The set path is read.', () => {
        expect(history.recentDirectory).toBe(path.join(os.tmpdir(), 'test', 'some/filepath.csv'))
      })
    })
  })

  // TODO: recent-documents
  // TODO: tab-history
})
