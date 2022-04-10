import { app, BrowserWindow } from 'electron'
import UpdateChecker from '@/main/modules/UpdateChecker'

describe.skip('Module: [UpdateChecker]', () => {
  beforeAll(() => app.whenReady)

  describe('Check update by bootstrap.', () => {
    beforeAll(() => {
      const window = new BrowserWindow()
      UpdateChecker.checkUpdate(window, true)
    })
  })
})
