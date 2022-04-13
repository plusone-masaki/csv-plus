import { app, dialog, BrowserWindow } from 'electron'
import ja from '@/assets/lang/ja.json'
import UpdateChecker from '@/main/modules/UpdateChecker'

describe('Module: [UpdateChecker]', () => {
  beforeAll(() => app.whenReady)

  describe.skip('Current version is v0.1.0, Check update by bootstrap.', () => {
    let dialogSpy: jest.SpyInstance
    beforeAll(() => {
      jest.mock('electron', () => ({
        ...jest.requireActual('@@/tests/mock/electron.ts'),
        app: { getVersion: () => '0.1.0' },
      }))
      dialogSpy = jest.spyOn(dialog, 'showMessageBox')

      const updateChecker = new UpdateChecker()
      const window = new BrowserWindow()
      return updateChecker.checkUpdate(window, true)
    })

    test('Open "New version available" dialog', () => {
      console.log(dialogSpy, dialogSpy.mock)
      expect(dialogSpy.mock.calls[0]).toBe(ja.system.update_available)
    })
  })
})
