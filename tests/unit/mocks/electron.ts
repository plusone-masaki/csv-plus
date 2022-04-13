import * as os from 'os'
import * as pathModule from 'path'

export const app = {
  getName: () => 'CSV+',
  getVersion: () => process.env.npm_package_version,
  getPath: jest.fn((path: string) => pathModule.join(os.tmpdir(), 'test', path)),
  setAboutPanelOptions: jest.fn(),
}

export const dialog = {
  showMessageBox: jest.fn(),
  showErrorBox: jest.fn(),
}

export const BrowserWindow = jest.fn()

export default {
  app,
  dialog,
  BrowserWindow,
}
