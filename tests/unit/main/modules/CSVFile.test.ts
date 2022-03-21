import CSVFile from '@/main/modules/CSVFile'
import * as channels from '@/common/channels'

const csvFile = new CSVFile()

describe('CSVFile', () => {
  describe('open 0 bytes csv', () => {
    let payload: channels.FILE_LOADED

    beforeAll(async () => {
      payload = await csvFile.open('@@/test/files/csv/0bytes.csv')
    })

    test('Not an error', () => {
      expect(payload).toBeTruthy()
    })

    test('Not an error', () => {
      expect(payload!.path).toContain('/test/files/csv/0bytes.csv')
    })
  })
})
