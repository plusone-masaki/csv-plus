import * as path from 'path'

export const app = {
  getName: () => 'CSV+',
  getVersion: () => process.env.npm_package_version,
  getPath: () => path.resolve('tests', 'files', 'data'),
  setAboutPanelOptions: jest.fn(),
}

export const dialog = {
  showErrorBox: jest.fn(),
}

export const BrowserWindow = jest.fn()
